from rest_framework import serializers
from .models import Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
class ProductSerializer(serializers.ModelSerializer):
    # 🔥 ভেন্ডর ফিল্ডটিকে read_only করে দেওয়া হলো, যাতে ফ্রন্টএন্ড থেকে এটি পাঠাতে না হয়
    vendor = serializers.PrimaryKeyRelatedField(read_only=True) 
    vendor_username = serializers.CharField(source='vendor.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'vendor', 'vendor_username', 'category', 'category_name', 'name', 'description', 'price', 'stock', 'is_available', 'image', 'created_at']
