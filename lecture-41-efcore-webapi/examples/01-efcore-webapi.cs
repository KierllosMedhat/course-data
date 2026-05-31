// EF CORE WITH WEB API — Lecture 41
// Example Controller

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EfCoreWebApi.Controllers
{
    /* 
    Requires an AppDbContext to be registered in Program.cs:
    builder.Services.AddDbContext<AppDbContext>(options => 
        options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
    */

    [ApiController]
    [Route("api/[controller]")]
    public class AuthorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        // Dependency Injection of DbContext
        public AuthorsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/authors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Author>>> GetAuthors()
        {
            // AsNoTracking() is recommended for read-only queries in APIs
            return await _context.Authors.AsNoTracking().ToListAsync();
        }

        // GET: api/authors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Author>> GetAuthor(int id)
        {
            // Include related data (Eager Loading)
            var author = await _context.Authors
                                       .Include(a => a.Books)
                                       .FirstOrDefaultAsync(a => a.Id == id);

            if (author == null)
            {
                return NotFound();
            }

            return author;
        }

        // POST: api/authors
        [HttpPost]
        public async Task<ActionResult<Author>> PostAuthor(Author author)
        {
            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAuthor), new { id = author.Id }, author);
        }

        // PUT: api/authors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAuthor(int id, Author author)
        {
            if (id != author.Id)
            {
                return BadRequest();
            }

            // Mark entity as modified
            _context.Entry(author).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuthorExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/authors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                return NotFound();
            }

            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AuthorExists(int id)
        {
            return _context.Authors.Any(e => e.Id == id);
        }
    }

    // Dummy classes for compiler
    public class AppDbContext : DbContext { 
        public DbSet<Author> Authors { get; set; } 
    }
    public class Author { 
        public int Id { get; set; } 
        public string Name { get; set; } 
        public List<Book> Books { get; set; } 
    }
    public class Book { public int Id { get; set; } }
}
