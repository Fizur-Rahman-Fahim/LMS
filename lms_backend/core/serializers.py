from rest_framework import serializers
from .models import Category, Course, Enrollment
from accounts.serializers import UserSerializer
from accounts.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source='instructor.full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    enrollment_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'category', 'category_name',
                  'instructor', 'instructor_name', 'thumbnail', 'duration_hours',
                  'is_published', 'enrollment_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'instructor', 'created_at', 'updated_at']

class EnrollmentSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), default=serializers.CurrentUserDefault())
    course_title = serializers.CharField(source='course.title', read_only=True)
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_name', 'course', 'course_title',
                  'enrolled_at', 'progress', 'completed']
        read_only_fields = ['id', 'enrolled_at']
    
    def validate(self, data):
        request = self.context.get('request')
        student = data.get('student') or getattr(request, 'user', None)
        course = data.get('course')

        if student and course and Enrollment.objects.filter(student=student, course=course).exists():
            raise serializers.ValidationError("Already enrolled in this course")

        return data