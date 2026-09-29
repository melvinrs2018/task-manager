from django.utils import timezone
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['completed_at']

    def update(self, instance, validated_data):
        if 'completed' in validated_data:
            if validated_data['completed'] and not instance.completed:
                instance.completed_at = timezone.now()
            elif not validated_data['completed']:
                instance.completed_at = None
        return super().update(instance, validated_data)
