from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser # 🔥 নতুন ইম্পোর্ট
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

# ক্যাটাগরি লিস্ট এবং তৈরি করার এপিআই
class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

# প্রোডাক্ট লিস্ট এবং নতুন প্রোডাক্ট যোগ করার এপিআই (ফ্রন্টএন্ড সাবমিট ফিক্স)
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by('-id') # নতুন প্রোডাক্ট আগে দেখাবে
    serializer_class = ProductSerializer
    
    # 🔥 ফাইল/ছবি এবং ডাটা একসাথে রিসিভ করার প্রফেশনাল পার্সার
    parser_classes = [MultiPartParser, FormParser] 

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()] # প্রোডাক্ট যোগ করতে লগইন টোকেন লাগবে
        return [permissions.AllowAny()] # প্রোডাক্ট দেখতে লগইন লাগবে না

    def perform_create(self, serializer):
        # ফ্রন্টএন্ড থেকে যে ভেন্ডর টোকেনসহ রিকোয়েস্ট পাঠিয়েছে, তাকেই 'vendor' হিসেবে ডাটাবেজে সেট করা
        serializer.save(vendor=self.request.user)
