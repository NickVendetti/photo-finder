using PhotoFinderAPI.Controllers;
using PhotoFinderAPI.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;

namespace PhotoFinderAPI.Tests;

public class PhotographerControllerTests
{
    private readonly PhotographersController _controller;

    public PhotographerControllerTests()
    {
        // AAA (Arrange/Act/Assert)
        // Arrange: create a controller with a fake service
        var fakeService = new MockPhotographerService();
        _controller = new PhotographersController(fakeService);
    }

    [Fact]
    public void GetAll_ReturnsListOfPhotographers()
    {
        // Act: call the method
        var result = _controller.GetAll();

        // Assert: check the result using FluentAssertions
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var photographers = okResult.Value.Should().BeOfType<List<Photographer>>().Subject;
        photographers.Should().HaveCount(2);
    }

    [Fact]
    public void GetById_WithValidId_ReturnsPhotographer()
    {
        // Act: call the method
        var result = _controller.GetById(MockPhotographerService.Id1);

        // Assert: check the result using FluentAssertions
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var photographer = okResult.Value.Should().BeOfType<Photographer>().Subject;
        photographer.Name.Should().Be("Test Photographer");
    }

    [Fact]
    public void GetById_WithInvalidId_ReturnsNotFound()
    {
        // Act: call the method
        var result = _controller.GetById(Guid.NewGuid());

        // Assert: check the result using FluentAssertions
        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public void Create_AddsPhotographerAndReturnsCreated()
    {
        var newPhotographer = new CreatePhotographerRequest {Bio = "test bio", Location = "PA", Name = "Create test", Rating = 1, Style = "sports"};
        var response = _controller.Create(newPhotographer);

        var result = response.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        var photographer = result.Value.Should().BeOfType<Photographer>().Subject;
        photographer.Bio.Should().Be(newPhotographer.Bio);
    }

    [Fact]
    public void Update_WithValidId_ReturnsUpdatedPhotographer()
    {
        var updatedPhotographer = new Photographer
        {
            Bio = "updated bio", Location = "updated location", Name = "updated Nick", Style = "updated style",
            Rating = 4.9
        };
        var update = _controller.Update(MockPhotographerService.Id1, updatedPhotographer);

        var result = update.Result.Should().BeOfType<OkObjectResult>().Subject;
        var photographer = result.Value.Should().BeOfType<Photographer>().Subject;
        photographer.Bio.Should().Be(updatedPhotographer.Bio);
    }

    [Fact]
    public void Update_WithInvalidId_ReturnsNotFound()
    {
        var result = _controller.Update(Guid.NewGuid(), new Photographer());

        result.Result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public void Delete_WithValidId_ReturnsNoContent()
    {
        var result = _controller.Delete(MockPhotographerService.Id1);

        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public void Delete_WithInvalidId_ReturnsNotFound()
    {
        var result = _controller.Delete(Guid.NewGuid());

        result.Should().BeOfType<NotFoundResult>();
    }
}