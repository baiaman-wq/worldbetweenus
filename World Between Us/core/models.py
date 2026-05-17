from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    title = models.CharField(max_length=200, verbose_name="Заголовок")
    content = models.TextField(verbose_name="Текст")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Автор")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Пост"
        verbose_name_plural = "Посты"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at'], name='post_created_desc_idx'),
        ]

class Grievance(models.Model):
    text = models.TextField(max_length=500, verbose_name="Текст жалобы")
    author = models.CharField(max_length=100, default="анонимка", verbose_name="Автор")
    sticker_color = models.CharField(max_length=20, default="#FFF9C4", verbose_name="Цвет стикера")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата подачи")
    is_moderated = models.BooleanField(default=True, verbose_name="Одобрено модерацией")

    def __str__(self):
        return f"{self.author}: {self.text[:30]}..."

    class Meta:
        verbose_name = "Жалоба"
        verbose_name_plural = "Жалобы"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['is_moderated', '-created_at'], name='grievance_mod_created_idx'),
        ]

class SchoolApplication(models.Model):
    FACULTY_CHOICES = [
        ('writing', 'креативное письмо'),
        ('rap', '★☆rap studies☆★'),
        ('design', 'школа дизайна'),
    ]
    name = models.CharField(max_length=150, verbose_name="Имя")
    email = models.EmailField(verbose_name="Email")
    faculty = models.CharField(max_length=50, choices=FACULTY_CHOICES, verbose_name="Направление")
    portfolio_link = models.URLField(blank=True, null=True, verbose_name="Ссылка на портфолио")
    essay = models.TextField(verbose_name="Эссе")
    submitted_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата отправки")

    def __str__(self):
        return f"{self.name} - {self.get_faculty_display()}"

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['-submitted_at'], name='application_submitted_desc_idx'),
        ]

