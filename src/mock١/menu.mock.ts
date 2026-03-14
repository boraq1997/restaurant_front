import type { MenuItem, MenuCategory } from '../types/menu.types'

export const categories: MenuCategory[] = [
  { id: 1, name: 'المشروبات الساخنة', icon: '☕' },
  { id: 2, name: 'المشروبات الباردة', icon: '🧃' },
  { id: 3, name: 'الوجبات الرئيسية', icon: '🍽️' },
  { id: 4, name: 'المقبلات', icon: '🥗' },
  { id: 5, name: 'الحلويات', icon: '🍰' },
]

export const menuItems: MenuItem[] = [
  // المشروبات الساخنة
  {
    id: 1, name: 'قهوة عربية',
    description: 'قهوة عربية أصيلة محضرة بالهيل والزعفران',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop',
    categoryId: 1, available: true,
    sizes: [
      { id: 1, name: 'صغير', price: 0 },
      { id: 2, name: 'وسط', price: 500 },
      { id: 3, name: 'كبير', price: 1000 },
    ],
    extras: [
      { id: 1, name: 'هيل إضافي', price: 250 },
      { id: 2, name: 'زعفران إضافي', price: 500 },
    ],
  },
  {
    id: 2, name: 'شاي كرك',
    description: 'شاي هندي كريمي بالحليب والهيل والزنجبيل',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=400&fit=crop',
    categoryId: 1, available: true,
    sizes: [
      { id: 1, name: 'صغير', price: 0 },
      { id: 2, name: 'كبير', price: 500 },
    ],
    extras: [
      { id: 3, name: 'سكر إضافي', price: 0 },
      { id: 4, name: 'حليب إضافي', price: 250 },
    ],
  },
  {
    id: 3, name: 'أمريكانو',
    description: 'إسبريسو مزدوج مع ماء ساخن بنسبة مثالية',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop',
    categoryId: 1, available: true,
    sizes: [
      { id: 1, name: 'صغير', price: 0 },
      { id: 2, name: 'وسط', price: 500 },
      { id: 3, name: 'كبير', price: 1000 },
    ],
    extras: [
      { id: 5, name: 'شوت إضافي', price: 750 },
    ],
  },

  // المشروبات الباردة
  {
    id: 4, name: 'عصير برتقال',
    description: 'عصير برتقال طازج معصور لحظياً بدون إضافات',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
    categoryId: 2, available: true,
    sizes: [
      { id: 1, name: 'صغير', price: 0 },
      { id: 2, name: 'كبير', price: 1000 },
    ],
    extras: [
      { id: 6, name: 'نعناع', price: 0 },
      { id: 7, name: 'ثلج إضافي', price: 0 },
    ],
  },
  {
    id: 5, name: 'ليموناضة',
    description: 'ليموناضة منعشة بالنعناع الطازج والليمون الحامض',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop',
    categoryId: 2, available: true,
    extras: [
      { id: 8, name: 'نعناع إضافي', price: 0 },
      { id: 9, name: 'توت أحمر', price: 500 },
    ],
  },
  {
    id: 6, name: 'موهيتو',
    description: 'موهيتو بدون كحول بالنعناع والليمون والصودا',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop',
    categoryId: 2, available: false,
  },

  // الوجبات الرئيسية
  {
    id: 7, name: 'برغر كلاسيك',
    description: 'لحم بقري طازج 200 غرام مع جبن شيدر وخضار طازجة وصوص خاص',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    categoryId: 3, available: true,
    sizes: [
      { id: 1, name: 'عادي', price: 0 },
      { id: 2, name: 'دبل', price: 3000 },
    ],
    extras: [
      { id: 10, name: 'جبن إضافي', price: 1000 },
      { id: 11, name: 'بيض مقلي', price: 1000 },
      { id: 12, name: 'بيكون', price: 1500 },
    ],
    removable: [
      { id: 1, name: 'خس' },
      { id: 2, name: 'طماطم' },
      { id: 3, name: 'بصل' },
      { id: 4, name: 'مخلل' },
    ],
  },
  {
    id: 8, name: 'دجاج مشوي',
    description: 'دجاج متبل بالأعشاب والثوم مشوي على الفحم مع أرز بسمتي وسلطة',
    price: 11000,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c1?w=400&h=400&fit=crop',
    categoryId: 3, available: true,
    extras: [
      { id: 13, name: 'صوص ثوم', price: 500 },
      { id: 14, name: 'أرز إضافي', price: 1500 },
    ],
    removable: [
      { id: 5, name: 'سلطة' },
      { id: 6, name: 'ليمون' },
    ],
  },
  {
    id: 9, name: 'باستا أرابياتا',
    description: 'باستا بيني بصوص طماطم حار مع الثوم والريحان الطازج',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=400&fit=crop',
    categoryId: 3, available: true,
    extras: [
      { id: 15, name: 'جبن بارميزان', price: 1000 },
      { id: 16, name: 'دجاج مشوي', price: 2000 },
    ],
    removable: [
      { id: 7, name: 'فلفل حار' },
      { id: 8, name: 'ثوم' },
    ],
  },

  // المقبلات
  {
    id: 10, name: 'حمص',
    description: 'حمص بالطحينة وزيت الزيتون البكر مع البابريكا والخبز العربي',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop',
    categoryId: 4, available: true,
    extras: [
      { id: 17, name: 'زيت زيتون إضافي', price: 250 },
      { id: 18, name: 'لحم مفروم', price: 2000 },
    ],
  },
  {
    id: 11, name: 'سلطة فتوش',
    description: 'خضار طازجة مع خبز مقرمش وصوص الرمان والسماق',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    categoryId: 4, available: true,
    removable: [
      { id: 9, name: 'خبز مقرمش' },
      { id: 10, name: 'بصل' },
    ],
  },

  // الحلويات
  {
    id: 12, name: 'تشيز كيك',
    description: 'تشيز كيك كريمي بقاعدة البسكويت مع صوص التوت الأحمر',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    categoryId: 5, available: true,
    extras: [
      { id: 19, name: 'كريمة إضافية', price: 500 },
      { id: 20, name: 'آيس كريم', price: 1500 },
    ],
  },
  {
    id: 13, name: 'كنافة',
    description: 'كنافة نابلسية أصيلة بالقشطة والقطر العربي وماء الورد',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&h=400&fit=crop',
    categoryId: 5, available: true,
    extras: [
      { id: 21, name: 'قشطة إضافية', price: 750 },
      { id: 22, name: 'مكسرات', price: 1000 },
    ],
  },
]