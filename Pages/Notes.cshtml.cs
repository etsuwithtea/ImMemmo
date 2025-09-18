using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ImMemmo.Models;
using ImMemmo.Services;

namespace ImMemmo.Pages
{
    public class NotesModel : PageModel
    {
        private readonly NotesService _notesService;

        public NotesModel(NotesService notesService)
        {
            _notesService = notesService;
        }

        public List<Note> Notes { get; set; } = new List<Note>();
        public int TrashCount { get; set; }

        [BindProperty]
        public Note CurrentNote { get; set; } = new Note();

        public void OnGet()
        {
            Notes = _notesService.GetAllNotes();
            TrashCount = _notesService.GetTrashCount();
        }

        public IActionResult OnPostSaveNote()
        {
            if (!ModelState.IsValid)
            {
                Notes = _notesService.GetAllNotes();
                TrashCount = _notesService.GetTrashCount();
                return Page();
            }

            if (CurrentNote.Id == 0)
            {
                _notesService.AddNote(CurrentNote);
            }
            else
            {
                _notesService.UpdateNote(CurrentNote);
            }

            return RedirectToPage();
        }

        public IActionResult OnPostDeleteNote(int id)
        {
            _notesService.DeleteNote(id);
            return RedirectToPage();
        }

        public IActionResult OnPostTogglePin(int id)
        {
            _notesService.TogglePin(id);
            return RedirectToPage();
        }

        public IActionResult OnGetNote(int id)
        {
            var note = _notesService.GetNoteById(id);
            if (note == null)
            {
                return NotFound();
            }
            return new JsonResult(note);
        }
    }
}