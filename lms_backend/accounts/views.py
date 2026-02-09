from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
import secrets
from .models import User, PasswordReset
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    ForgotPasswordSerializer, ResetPasswordSerializer
)

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = User.objects.get(email=serializer.validated_data['email'])
        token = secrets.token_urlsafe(32)
        
        PasswordReset.objects.create(user=user, token=token)
        
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}"
        send_mail(
            'Password Reset Request',
            f'Click here to reset your password: {reset_url}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
        )
        
        return Response({'message': 'Reset link sent to email'})

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        reset = PasswordReset.objects.get(token=serializer.validated_data['token'])
        user = reset.user
        user.set_password(serializer.validated_data['password'])
        user.save()
        reset.is_used = True
        reset.save()
        
        return Response({'message': 'Password reset successfully'})

        