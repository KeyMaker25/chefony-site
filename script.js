/* ============================================
   LANGUAGE & LOCALIZATION
   ============================================ */
let currentLanguage = 'en';

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'he' : 'en';
    updateLanguage();
    localStorage.setItem('language', currentLanguage);
    
    // Update document direction
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'he' ? 'rtl' : 'ltr';
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(el => {
        if (currentLanguage === 'en') {
            el.textContent = el.getAttribute('data-en');
        } else {
            el.textContent = el.getAttribute('data-he');
        }
    });

    // Update input placeholders
    document.querySelectorAll('[data-placeholder-en]').forEach(el => {
        if (currentLanguage === 'en') {
            el.placeholder = el.getAttribute('data-placeholder-en');
        } else {
            el.placeholder = el.getAttribute('data-placeholder-he');
        }
    });
}

// Initialize language from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    currentLanguage = savedLanguage;
    
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'he' ? 'rtl' : 'ltr';
    updateLanguage();
});

/* ============================================
   SAMPLE MEALS DATABASE
   ============================================ */
function getMealsData() {
    return [
        {
            id: 1,
            name: 'Pasta Carbonara',
            cuisine: 'italian',
            specialty: 'Italian Classic',
            rating: 5,
            reviews: 127,
            price: 14.99,
            priceRange: 'moderate',
            description: 'Authentic Italian pasta with creamy egg sauce, pancetta, and parmesan cheese.',
            image: '🍝'
        },
        {
            id: 2,
            name: 'Coq au Vin',
            cuisine: 'french',
            specialty: 'French Cuisine',
            rating: 4.9,
            reviews: 95,
            price: 19.99,
            priceRange: 'premium',
            description: 'Tender chicken braised in red wine with mushrooms and pearl onions.',
            image: '🍗'
        },
        {
            id: 3,
            name: 'Sushi Platter',
            cuisine: 'asian',
            specialty: 'Japanese Fresh',
            rating: 4.8,
            reviews: 82,
            price: 16.99,
            priceRange: 'moderate',
            description: 'Assorted premium sushi rolls with fresh fish, vegetables, and perfect rice.',
            image: '🍣'
        },
        {
            id: 4,
            name: 'Greek Moussaka',
            cuisine: 'mediterranean',
            specialty: 'Greek Tradition',
            rating: 4.7,
            reviews: 110,
            price: 15.99,
            priceRange: 'moderate',
            description: 'Layered eggplant and meat sauce topped with creamy béchamel sauce.',
            image: '🍆'
        },
        {
            id: 5,
            name: 'BBQ Ribs Platter',
            cuisine: 'american',
            specialty: 'American BBQ',
            rating: 4.6,
            reviews: 88,
            price: 17.99,
            priceRange: 'moderate',
            description: 'Slow-smoked ribs with homemade BBQ sauce, coleslaw, and cornbread.',
            image: '🍖'
        },
        {
            id: 6,
            name: 'Butter Chicken',
            cuisine: 'asian',
            specialty: 'Indian Spice',
            rating: 4.9,
            reviews: 120,
            price: 13.99,
            priceRange: 'budget',
            description: 'Tender chicken in creamy tomato sauce with aromatic Indian spices.',
            image: '🍛'
        },
        {
            id: 7,
            name: 'Paella Valenciana',
            cuisine: 'mediterranean',
            specialty: 'Spanish Delight',
            rating: 4.7,
            reviews: 75,
            price: 18.99,
            priceRange: 'premium',
            description: 'Saffron-infused rice with seafood, chorizo, and fresh vegetables.',
            image: '🥘'
        },
        {
            id: 8,
            name: 'Chocolate Lava Cake',
            cuisine: 'french',
            specialty: 'French Dessert',
            rating: 5,
            reviews: 200,
            price: 8.99,
            priceRange: 'budget',
            description: 'Decadent warm chocolate cake with molten center, served with vanilla ice cream.',
            image: '🍰'
        }
    ];
}

/* ============================================
   MEAL RENDERING & FILTERING
   ============================================ */
function renderMeals(meals) {
    const grid = document.getElementById('mealsGrid');
    if (!grid) return;
    
    if (meals.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p data-en="No meals found matching your criteria." data-he="לא נמצאו ארוחות המתאימות לקריטריונים שלך.">No meals found matching your criteria.</p></div>';
        return;
    }

    grid.innerHTML = meals.map(meal => `
        <div class="meal-card">
            <div class="meal-image">${meal.image}</div>
            <div class="meal-info">
                <div class="meal-name">${meal.name}</div>
                <div class="meal-cuisine">${meal.specialty}</div>
                <div class="meal-rating">⭐ ${meal.rating} (${meal.reviews} ${currentLanguage === 'en' ? 'reviews' : 'ביקורות'})</div>
                <div class="meal-price">$${meal.price}</div>
                <div class="meal-description">${meal.description}</div>
                <button class="btn btn-primary" onclick="orderMeal(${meal.id})" data-en="Add to Order" data-he="הוסף להזמנה"></button>
            </div>
        </div>
    `).join('');

    updateLanguage();
}

function filterMeals() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const cuisineFilter = document.getElementById('cuisineFilter')?.value || '';
    const ratingFilter = document.getElementById('ratingFilter')?.value || '';
    const priceFilter = document.getElementById('priceFilter')?.value || '';

    const allMeals = getMealsData();
    
    const filtered = allMeals.filter(meal => {
        const matchesSearch = meal.name.toLowerCase().includes(searchTerm) || 
                             meal.specialty.toLowerCase().includes(searchTerm);
        const matchesCuisine = !cuisineFilter || meal.cuisine === cuisineFilter;
        const matchesRating = !ratingFilter || meal.rating >= parseFloat(ratingFilter);
        const matchesPrice = !priceFilter || meal.priceRange === priceFilter;
        
        return matchesSearch && matchesCuisine && matchesRating && matchesPrice;
    });

    renderMeals(filtered);
}

/* ============================================
   ORDERING FUNCTIONALITY WITH MODAL
   ============================================ */
let selectedMealId = null;

function orderMeal(mealId) {
    selectedMealId = mealId;
    const meal = getMealsData().find(m => m.id === mealId);
    openModal(meal ? `Order: ${meal.name}` : 'Contact Us');
}

function openModal(title = null) {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'block';
        if (title) {
            const heading = modal.querySelector('h2');
            if (heading && !selectedMealId) {
                heading.textContent = title;
            }
        }
    }
}

function closeModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('contactForm').reset();
        selectedMealId = null;
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('contactModal');
    if (event.target === modal) {
        closeModal();
    }
}

async function submitForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Validate phone is 9 digits
    if (!/^\d{9}$/.test(phone)) {
        alert(currentLanguage === 'en' ? 'Please enter a valid 9-digit phone number' : 'אנא הזן מספר טלפון תקני של 9 ספרות');
        return;
    }
    
    // Get meal info if applicable
    let mealInfo = '';
    if (selectedMealId) {
        const meal = getMealsData().find(m => m.id === selectedMealId);
        if (meal) {
            mealInfo = `Meal: ${meal.name}\n`;
        }
    }
    
    // Prepare email content
    const emailContent = `New Order Request\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n${mealInfo}\nMessage: ${message}`;
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type=\"submit\"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = currentLanguage === 'en' ? 'Sending...' : 'שולח...';
    
    try {
        // Send email via Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer re_fSJWWiZ7_N52iwLpDWjrXwYCDpTghZKxU'
            },
            body: JSON.stringify({
                from: 'noreply@chefony.com',
                to: 'contact@chefony.com',
                subject: `New Order Request from ${name}`,
                html: `
                    <h2>New Order Request</h2>
                    <p><strong>Name:</strong> ${name}</p>\n
                    <p><strong>Phone:</strong> ${phone}</p>\n
                    <p><strong>Email:</strong> ${email || 'Not provided'}</p>\n
                    ${mealInfo ? `<p><strong>${mealInfo}</strong></p>` : ''}\n
                    <p><strong>Message:</strong></p>\n
                    <p>${message.replace(/\n/g, '<br>')}</p>
                `
            })
        });
        
        if (response.ok) {
            alert(currentLanguage === 'en' ? 'Thank you! Your request has been sent.' : 'תודה! בקשתך נשלחה בהצלחה.');
            closeModal();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to send email');
        }
    } catch (error) {
        console.error('Error sending email:', error);
        alert(currentLanguage === 'en' ? 'Error sending request. Please try again.' : 'שגיאה בשליחת הבקשה. אנא נסו שוב.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

/* ============================================
   SMOOTH SCROLL & EVENT LISTENERS
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

/* ============================================
   ACTIVE NAV LINK INDICATOR
   ============================================ */
window.addEventListener('scroll', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            const section = document.querySelector(href);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        }
    });
});
