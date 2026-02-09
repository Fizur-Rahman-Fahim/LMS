from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, CourseViewSet, EnrollmentViewSet, DashboardViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet)
router.register('courses', CourseViewSet)
router.register('enrollments', EnrollmentViewSet)
router.register('dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]