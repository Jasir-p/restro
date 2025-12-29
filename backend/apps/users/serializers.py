from rest_framework import serializers
from .models import Worker
from django.contrib.auth.models import Group
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class WorkerSerializers(serializers.ModelSerializer):
    
    role = serializers.CharField(write_only=True)

    class Meta:
        model = Worker
        fields = ["id", "username", "email", "phone", "role", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def validate_role(self, value):
        try:
            group = Group.objects.get(name=value)
        except Group.DoesNotExist:
            raise serializers.ValidationError(
                f"Role '{value}' does not exist."
            )
        return group   # return Group object

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        group = validated_data.pop("role")

        user = Worker(**validated_data)
        user.set_password(password)
        user.save()
        user.groups.add(group)

        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["roles"] = list(user.groups.values_list("name", flat=True))

        return token