from rest_framework import serializers
from .models import User, PasswordReset
from django.contrib.auth import authenticate
import secrets

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'theme', 'bio', 'profile_picture', 'is_active', 'is_staff', 'is_superuser', 'date_joined']
        read_only_fields = ['id', 'is_active', 'is_staff', 'is_superuser', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'role', 'theme']
    
    def validate_role(self, value):
        if value == 'admin':
            raise serializers.ValidationError("Cannot register as admin")
        return value
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        if not user.is_active:
            raise serializers.ValidationError("User is not active")
        data['user'] = user
        return data

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        return value
    
class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)
    
    def validate(self, data):
        try:
            reset = PasswordReset.objects.get(token=data['token'])
            if not reset.is_valid():
                raise serializers.ValidationError("Invalid token")
            data['reset'] = reset
        except PasswordReset.DoesNotExist:
            raise serializers.ValidationError("Invalid token")
        return data