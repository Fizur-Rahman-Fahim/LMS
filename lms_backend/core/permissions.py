from rest_framework import permissions

class IsAdminOrInstructor(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.is_superuser or request.user.role in ['admin', 'instructor']

class IsAdminOrOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser or request.user.role == 'admin':
            return True
        if hasattr(obj, 'instructor'):
            return obj.instructor == request.user
        return obj == request.user