from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# ১. প্রোডাক্ট ক্যাটাগরি মডেল
class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True, null=True) # URL-বান্ধব নামের জন্য (যেমন: electronics)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

# ২. প্রোডাক্ট মডেল
class Product(models.Model):
    # কোন ভেন্ডর প্রোডাক্টটি দিচ্ছে (accounts অ্যাপের ইউজারের সাথে রিলেশন)
    vendor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2) # যেমন: 999.99
    
    # ইনভেন্টরি এবং স্টক ম্যানেজমেন্ট
    stock = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    
    # ইমেজ এবং টাইমস্ট্যাম্প
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    # স্টক শূন্য হলে অটোমেটিক নট-অ্যাভেইলেবল করার লজিক
    def save(self, *args, **kwargs):
        if self.stock <= 0:
            self.is_available = False
        else:
            self.is_available = True
        super().save(*args, **kwargs)
