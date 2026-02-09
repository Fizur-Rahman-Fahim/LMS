from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from .models import Category, Course, Enrollment
from .serializers import CategorySerializer, CourseSerializer, EnrollmentSerializer
from .permissions import IsAdminOrInstructor, IsAdminOrOwner
from accounts.models import User

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrInstructor()]
        return [IsAuthenticated()]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('category', 'instructor').all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category__name']
    ordering_fields = ['created_at', 'title']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrInstructor()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        
        if user.is_superuser or user.role == 'admin':
            return qs
        if user.role == 'instructor':
            return qs.filter(Q(instructor=user) | Q(is_published=True))
        elif user.role == 'student':
            return qs.filter(is_published=True)
        return qs
    
    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_courses(self, request):
        user = request.user
        if user.is_superuser or user.role == 'admin':
            courses = self.get_queryset()
        elif user.role == 'instructor':
            courses = self.get_queryset().filter(instructor=user)
        else:
            courses = Course.objects.filter(enrollments__student=user)
        
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.select_related('course', 'student').all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return self.queryset.filter(student=user)
        elif user.role == 'instructor':
            return self.queryset.filter(course__instructor=user)
        return self.queryset
    
    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_enrollments(self, request):
        enrollments = self.get_queryset().filter(student=request.user)
        serializer = self.get_serializer(enrollments, many=True)
        return Response(serializer.data)

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = request.user
        
        if user.is_superuser or user.role == 'admin':
            stats = {
                'total_users': User.objects.count(),
                'total_courses': Course.objects.count(),
                'total_enrollments': Enrollment.objects.count(),
                'admin_count': User.objects.filter(Q(role='admin') | Q(is_superuser=True)).distinct().count(),
                'instructor_count': User.objects.filter(role='instructor').count(),
                'student_count': User.objects.filter(role='student').count(),
            }
        elif user.role == 'instructor':
            stats = {
                'my_courses': Course.objects.filter(instructor=user).count(),
                'total_students': Enrollment.objects.filter(course__instructor=user).values('student').distinct().count(),
                'total_enrollments': Enrollment.objects.filter(course__instructor=user).count(),
            }
        else:
            stats = {
                'enrolled_courses': Enrollment.objects.filter(student=user).count(),
                'completed_courses': Enrollment.objects.filter(student=user, completed=True).count(),
                'in_progress': Enrollment.objects.filter(student=user, completed=False).count(),
            }
        
        return Response(stats)