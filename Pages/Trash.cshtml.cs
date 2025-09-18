using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ImMemmo.Models;
using ImMemmo.Services;

namespace ImMemmo.Pages
{
    public class TrashModel : PageModel
    {
        private readonly NotesService _notesService;

        public TrashModel(NotesService notesService)
        {
            _notesService = notesService;
        }

        public List<Note> DeletedNotes { get; set; } = new List<Note>();

        public void OnGet()
        {
            DeletedNotes = _notesService.GetDeletedNotes();
        }

        public IActionResult OnPostRestoreNote(int id)
        {
            _notesService.RestoreNote(id);
            return RedirectToPage();
        }

        public IActionResult OnPostPermanentlyDeleteNote(int id)
        {
            _notesService.PermanentlyDeleteNote(id);
            return RedirectToPage();
        }

        public IActionResult OnPostEmptyTrash()
        {
            _notesService.EmptyTrash();
            return RedirectToPage();
        }
    }
}