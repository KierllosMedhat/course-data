using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;

namespace AutoMapperLab.Labs
{
    // ==========================================
    // 1. Entities
    // ==========================================
    
    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class Employee
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public decimal Salary { get; set; } // Hide this in DTO
        public DateTime HireDate { get; set; }
        public Department Department { get; set; } = new();
    }

    // ==========================================
    // 2. DTO
    // ==========================================
    
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int YearsEmployed { get; set; } // Calculated value
        public string DepartmentName { get; set; } = string.Empty; // Flattened property
    }

    // ==========================================
    // 3. Mapping Profile
    // ==========================================
    
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // TODO: Define mapping rules from Employee -> EmployeeDto
            // 1. Map simple properties automatically.
            // 2. Map Department.Name -> DepartmentName (Convention-based flattening works automatically).
            // 3. Map YearsEmployed from (DateTime.Now.Year - HireDate.Year) using .ForMember()
            // Hint:
            // CreateMap<Employee, EmployeeDto>()
            //     .ForMember(dest => dest.YearsEmployed, opt => opt.MapFrom(src => DateTime.Now.Year - src.HireDate.Year));
        }
    }

    // ==========================================
    // 4. Controller
    // ==========================================
    
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IMapper _mapper;

        public EmployeeController(IMapper mapper)
        {
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetEmployees()
        {
            // Dummy database in-memory list
            var dept = new Department { Id = 101, Name = "Engineering" };
            var employees = new List<Employee>
            {
                new Employee { Id = 1, FullName = "Alice Smith", Salary = 95000, HireDate = DateTime.Now.AddYears(-5), Department = dept },
                new Employee { Id = 2, FullName = "Bob Jones", Salary = 80000, HireDate = DateTime.Now.AddYears(-2), Department = dept }
            };

            // TODO: Map the list of Employee entities to a list of EmployeeDto
            // Hint: Use _mapper.Map<IEnumerable<EmployeeDto>>(employees);

            return Ok(new
            {
                Message = "Retrieve mapped DTOs here."
            });
        }
    }
}
