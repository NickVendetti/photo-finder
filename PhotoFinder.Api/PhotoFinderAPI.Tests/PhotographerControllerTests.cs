using PhotoFinderAPI.Controllers;
using PhotoFinderAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace PhotoFinderAPI.Tests;

public class PhotographerControllerTests
{
    private readonly PhotographersController _controller;

    public PhotographerControllerTests()
    {
        // AAA (Arrange/Act/Assert)
        // Arrange: create a controller with a fake service
        var fakeService = new FakePhotographerService();
        _controller = new PhotographersController(fakeService);
    }

    [Fact]
    public void GetAll_ReturnsListOfPhotographers()
    {
        // Act: call the method
        var result = _controller.GetAll();
        
        // Assert: check the result
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var photographers = Assert.IsType<List<Photographer>>(okResult.Value);
        Assert.Equal(2, photographers.Count);
    }

    [Fact]
    public void GetById_WithValidId_ReturnsPhotographer()
    {
        // Act: call the method
        var result = _controller.GetById(1);
        
        // Assert: check the result
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var photographer = Assert.IsType<Photographer>(okResult.Value);
        Assert.Equal("Test Photographer", photographer.Name);
    }

    [Fact]
    public void GetById_WithInvalidId_ReturnsNotFound()
    {
        // Act: call the method
        var result = _controller.GetById(-1);
        
        // Assert: check the result
       Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public void Create_AddsPhotographerAndReturnsCreated()
    {
        var newPhotographer = new Photographer{Bio = "test bio", Id = 3, Location = "PA", Name = "Create test", Rating = 1, Style = "sports"};
        var response = _controller.Create(newPhotographer);
        
        var result = Assert.IsType<CreatedAtActionResult>(response.Result);
        var photographer = Assert.IsType<Photographer>(result.Value);
        Assert.Equal(newPhotographer.Bio, photographer.Bio);
    }
} 