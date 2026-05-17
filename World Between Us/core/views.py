from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib import messages
from .models import Post, Grievance, SchoolApplication
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import random

def index(request):
    posts = Post.objects.all().order_by('-created_at')
    grievances = Grievance.objects.filter(is_moderated=True).order_by('-created_at')
    return render(request, 'index.html', {'posts': posts, 'grievances': grievances})


def user_register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Имя пользователя уже занято.')
            return redirect('register')
        user = User.objects.create_user(username=username, password=password)
        login(request, user)
        return redirect('index')
    return render(request, 'register_user.html')

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            messages.error(request, 'Неверное имя пользователя или пароль.')
    return render(request, 'login.html')

def user_logout(request):
    logout(request)
    return redirect('index')

def create_post(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if request.method == 'POST':
        title = request.POST.get('title')
        content = request.POST.get('content')
        if title and content:
            Post.objects.create(title=title, content=content, author=request.user)
            return redirect('index')
    return render(request, 'create_post.html')


@require_POST
def api_submit_grievance(request):
    text = request.POST.get('text', '').strip()
    author = request.POST.get('author', '').strip()
    
    if not text:
        return JsonResponse({'success': False, 'error': 'Текст жалобы не может быть пустым.'}, status=400)
    
    if not author:
        author = 'анонимка'
        
    # Pastellic sticky notes colors matching retro whiteboard design
    colors = ['#FFF9C4', '#F8BBD0', '#C8E6C9', '#B3E5FC', '#D1C4E9', '#FFE0B2', '#E1BEE7']
    sticker_color = random.choice(colors)
    
    grievance = Grievance.objects.create(
        text=text,
        author=author,
        sticker_color=sticker_color,
        is_moderated=True  # Auto-approved for instant visual satisfaction in demo, can be toggled in admin
    )
    
    return JsonResponse({
        'success': True,
        'grievance': {
            'id': grievance.id,
            'text': grievance.text,
            'author': grievance.author,
            'sticker_color': grievance.sticker_color,
            'created_at': grievance.created_at.strftime('%d.%m.%Y %H:%M')
        }
    })

@require_POST
def api_submit_application(request):
    name = request.POST.get('name', '').strip()
    email = request.POST.get('email', '').strip()
    faculty = request.POST.get('faculty', '').strip()
    portfolio_link = request.POST.get('portfolio_link', '').strip()
    essay = request.POST.get('essay', '').strip()
    
    if not name or not email or not faculty or not essay:
        return JsonResponse({'success': False, 'error': 'Пожалуйста, заполните все обязательные поля.'}, status=400)
        
    valid_faculties = [choice[0] for choice in SchoolApplication.FACULTY_CHOICES]
    if faculty not in valid_faculties:
        return JsonResponse({'success': False, 'error': 'Выбрано неверное направление.'}, status=400)
        
    application = SchoolApplication.objects.create(
        name=name,
        email=email,
        faculty=faculty,
        portfolio_link=portfolio_link if portfolio_link else None,
        essay=essay
    )
    
    return JsonResponse({
        'success': True,
        'message': f'Твоя грустная заявка успешно отправлена на направление "{application.get_faculty_display()}"! Мы свяжемся с тобой.'
    })

