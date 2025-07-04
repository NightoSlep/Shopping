import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { Category } from '../entities/category.entity';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string): Promise<Category> {
    const category = await this.categoryService.getCategoryById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}
