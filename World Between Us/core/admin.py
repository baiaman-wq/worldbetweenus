from django.contrib import admin
from .models import Post, Grievance, SchoolApplication

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at')
    search_fields = ('title', 'content')

@admin.register(Grievance)
class GrievanceAdmin(admin.ModelAdmin):
    list_display = ('author', 'text_excerpt', 'created_at', 'is_moderated')
    list_filter = ('is_moderated', 'created_at')
    list_editable = ('is_moderated',)
    search_fields = ('author', 'text')

    def text_excerpt(self, obj):
        return obj.text[:60] + "..." if len(obj.text) > 60 else obj.text
    text_excerpt.short_description = "Текст жалобы"

@admin.register(SchoolApplication)
class SchoolApplicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'faculty', 'submitted_at')
    list_filter = ('faculty', 'submitted_at')
    search_fields = ('name', 'email', 'essay')

