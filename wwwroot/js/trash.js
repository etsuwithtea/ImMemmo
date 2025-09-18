// Trash functionality

// Restore note function
function restoreNote(id) {
    if (confirm('Restore this note?')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/Trash?handler=RestoreNote';
        
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
}

// Permanently delete note function
function permanentlyDeleteNote(id) {
    if (confirm('This will permanently delete the note. This action cannot be undone. Are you sure?')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/Trash?handler=PermanentlyDeleteNote';
        
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
}

// Empty trash function
function emptyTrash() {
    if (confirm('This will permanently delete all notes in trash. This action cannot be undone. Are you sure?')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/Trash?handler=EmptyTrash';
        
        const token = document.querySelector('input[name="__RequestVerificationToken"]');
        if (token) {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '__RequestVerificationToken';
            tokenInput.value = token.value;
            form.appendChild(tokenInput);
        }
        
        document.body.appendChild(form);
        form.submit();
    }
}

// Animate card removal
function animateCardRemoval(cardElement) {
    cardElement.style.transition = 'all 0.3s ease';
    cardElement.style.transform = 'translateX(-100%)';
    cardElement.style.opacity = '0';
    
    setTimeout(() => {
        cardElement.remove();
    }, 300);
}

// Add hover effects for trash cards
document.addEventListener('DOMContentLoaded', function() {
    const trashCards = document.querySelectorAll('.note-card.deleted');
    
    trashCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});