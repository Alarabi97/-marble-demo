/**
 * حالة التطبيق المركزية
 */
const AppState = {
    role: 'admin',
    events: [
        { title: 'حفل زفاف سارة', date: '2024-12-20', status: 'نشط' },
        { title: 'عشاء عائلي', date: '2024-12-25', status: 'قادم' },
        { title: 'حفل خطوبة ليلى', date: '2024-12-10', status: 'منتهي' }
    ]
};

/**
 * ثوابت الأدوار
 */
const ROLES = {
    ADMIN: 'admin',
    STAFF: 'staff'
};

/**
 * قائمة الأدوار مع التسميات
 */
const ROLE_LABELS = [
    { role: ROLES.ADMIN, label: '👑 إحسان' },
    { role: ROLES.STAFF, label: '👩‍💼 مساعدة' }
];

/**
 * مدير الفعاليات - فئة تدير التطبيق
 */
class EventManager {
    constructor(state) {
        this.state = state;
        this.init();
    }

    /**
     * تهيئة التطبيق وربط المستمعين
     */
    init() {
        this.setupEventListeners();
        this.render();
    }

    /**
     * إعداد مستمعي الأحداث باستخدام Event Delegation
     */
    setupEventListeners() {
        // مستمع الأدوار
        document.getElementById('roleButtons').addEventListener('click', (event) => {
            if (event.target.classList.contains('role')) {
                this.setRole(event.target.dataset.role, event.target);
            }
        });

        // مستمع صندوق الفعاليات
        document.getElementById('box').addEventListener('click', (event) => {
            if (event.target.dataset.action === 'add') {
                this.addEvent();
            } else if (event.target.dataset.action === 'delete') {
                const index = parseInt(event.target.dataset.index, 10);
                this.deleteEvent(index);
            }
        });
    }

    /**
     * تغيير الدور الحالي
     */
    setRole(role, btnElement) {
        this.state.role = role;
        
        // إزالة الفئة النشطة من جميع الأزرار
        document.querySelectorAll('.role').forEach(btn => {
            btn.classList.remove('on');
        });
        
        // إضافة الفئة النشطة للزر المختار
        btnElement.classList.add('on');
        
        this.render();
    }

    /**
     * إضافة فعالية جديدة
     */
    addEvent() {
        const title = prompt('اسم الفعالية:');
        if (!title || title.trim() === '') return;

        const date = prompt('التاريخ (مثال 2024-12-30):') || 'بدون تاريخ';
        
        this.state.events.push({
            title: title.trim(),
            date: date.trim(),
            status: 'قادم'
        });
        
        this.render();
    }

    /**
     * حذف فعالية
     */
    deleteEvent(index) {
        if (index < 0 || index >= this.state.events.length) return;
        
        if (confirm('هل تريد حذف الفعالية؟')) {
            this.state.events.splice(index, 1);
            this.render();
        }
    }

    /**
     * إعادة رسم الواجهة
     */
    render() {
        this.renderRoleButtons();
        this.renderEvents();
    }

    /**
     * رسم أزرار الأدوار
     */
    renderRoleButtons() {
        const container = document.getElementById('roleButtons');
        const fragment = document.createDocumentFragment();

        ROLE_LABELS.forEach(({ role, label }) => {
            const btn = document.createElement('button');
            btn.className = `role ${role === this.state.role ? 'on' : ''}`;
            btn.dataset.role = role;
            btn.textContent = label;
            fragment.appendChild(btn);
        });

        container.innerHTML = '';
        container.appendChild(fragment);
    }

    /**
     * رسم قائمة الفعاليات
     */
    renderEvents() {
        const box = document.getElementById('box');
        const fragment = document.createDocumentFragment();
        const isAdmin = this.state.role === ROLES.ADMIN;

        // رسم الرأس
        const header = document.createElement('div');
        
        if (isAdmin) {
            const addBtn = document.createElement('button');
            addBtn.className = 'add';
            addBtn.textContent = '+';
            addBtn.dataset.action = 'add';
            addBtn.title = 'إضافة فعالية جديدة';
            header.appendChild(addBtn);
        }

        const title = document.createElement('h3');
        title.className = 'box-title';
        title.textContent = `📋 الفعاليات (${this.state.events.length})`;
        header.appendChild(title);

        if (!isAdmin) {
            const notice = document.createElement('p');
            notice.className = 'box-notice';
            notice.textContent = '👀 عرض فقط';
            header.appendChild(notice);
        }

        fragment.appendChild(header);

        // رسم قائمة الفعاليات أو الحالة الفارغة
        if (this.state.events.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = '<div class="empty-state-icon">📭</div><p>لا توجد فعاليات</p>';
            fragment.appendChild(emptyState);
        } else {
            this.state.events.forEach((event, index) => {
                const item = document.createElement('div');
                item.className = 'item';

                const content = document.createElement('div');
                content.className = 'item-content';

                const titleEl = document.createElement('b');
                titleEl.textContent = event.title;
                content.appendChild(titleEl);

                const meta = document.createElement('small');
                meta.textContent = `📅 ${event.date} • ${event.status}`;
                content.appendChild(meta);

                item.appendChild(content);

                // إضافة زر الحذف للمسؤول فقط
                if (isAdmin) {
                    const actions = document.createElement('div');
                    actions.className = 'item-actions';

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.textContent = '🗑️';
                    deleteBtn.data-action = 'delete';
                    deleteBtn.dataset.action = 'delete';
                    deleteBtn.dataset.index = index;
                    deleteBtn.title = 'حذف الفعالية';

                    actions.appendChild(deleteBtn);
                    item.appendChild(actions);
                }

                fragment.appendChild(item);
            });
        }

        box.innerHTML = '';
        box.appendChild(fragment);
    }
}

/**
 * بدء التطبيق عند تحميل الصفحة
 */
document.addEventListener('DOMContentLoaded', () => {
    new EventManager(AppState);
});
