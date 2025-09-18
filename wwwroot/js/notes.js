// Notes App JavaScript

// Search functionality
document.getElementById('searchInput')?.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const noteCards = document.querySelectorAll('.note-card');
    
    noteCards.forEach(card => {
        const title = card.querySelector('.note-title').textContent.toLowerCase();
        const content = card.querySelector('.note-content').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
});

// Edit note function
function editNote(id) {
    fetch(`/Notes?handler=Note&id=${id}`)
        .then(response => response.json())
        .then(note => {
            document.getElementById('noteId').value = note.id;
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            
            // Set color
            const colorRadio = document.querySelector(`input[value="${note.color}"]`);
            if (colorRadio) {
                colorRadio.checked = true;
            }
            
            // Update modal title
            document.getElementById('noteModalLabel').textContent = 'Edit Note';
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('noteModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error fetching note:', error);
            alert('Error loading note for editing');
        });
}

// Delete note function
function deleteNote(id) {
    if (confirm('Move this note to trash?')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/Notes?handler=DeleteNote';
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'id';
        input.value = id;
        
        const token = document.querySelector('input[name="__RequestVerificationToken"]');
        if (token) {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '__RequestVerificationToken';
            tokenInput.value = token.value;
            form.appendChild(tokenInput);
        }
        
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        
        // Show success message
        showToast('Note moved to trash', 'success');
    }
}

// Toggle pin function
function togglePin(id) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/Notes?handler=TogglePin';
    
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'id';
    input.value = id;
    
    const token = document.querySelector('input[name="__RequestVerificationToken"]');
    if (token) {
        const tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '__RequestVerificationToken';
        tokenInput.value = token.value;
        form.appendChild(tokenInput);
    }
    
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}

// Reset modal when adding new note
document.querySelector('[data-bs-target="#noteModal"]')?.addEventListener('click', function() {
    document.getElementById('noteId').value = '0';
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteModalLabel').textContent = 'Add New Note';
    
    // Reset color selection
    const firstColor = document.querySelector('input[name="CurrentNote.Color"]');
    if (firstColor) {
        firstColor.checked = true;
    }
});

// Auto-resize textarea
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('noteContent');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + N for new note
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const addButton = document.querySelector('[data-bs-target="#noteModal"]');
        if (addButton) {
            addButton.click();
        }
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = bootstrap.Modal.getInstance(document.getElementById('noteModal'));
        if (modal) {
            modal.hide();
        }
    }
});

// Toast notification function
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    toast.style.cssText = `
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Add loading animation
function showLoading() {
    const grid = document.getElementById('notesGrid');
    if (grid) {
        grid.classList.add('loading');
    }
}

function hideLoading() {
    const grid = document.getElementById('notesGrid');
    if (grid) {
        grid.classList.remove('loading');
    }
}

// Smooth scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all note cards
document.querySelectorAll('.note-card').forEach(card => {
    observer.observe(card);
});