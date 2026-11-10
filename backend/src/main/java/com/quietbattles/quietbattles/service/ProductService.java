
package com.quietbattles.quietbattles.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.quietbattles.quietbattles.dto.ProductRequestDTO;
import com.quietbattles.quietbattles.dto.ProductResponseDTO;
import com.quietbattles.quietbattles.entity.Chapter;
import com.quietbattles.quietbattles.entity.Product;
import com.quietbattles.quietbattles.repository.ChapterRepository;
import com.quietbattles.quietbattles.repository.ProductRepository;
import com.quietbattles.quietbattles.exception.ResourceNotFoundException;
import com.quietbattles.quietbattles.exception.DuplicateResourceException;
@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ChapterRepository chapterRepository;

    public ProductService(ProductRepository productRepository,
                          ChapterRepository chapterRepository) {
        this.productRepository = productRepository;
        this.chapterRepository = chapterRepository;
    }

    // Create Product
    public ProductResponseDTO saveProduct(ProductRequestDTO dto) {

        Chapter chapter = chapterRepository.findById(dto.getChapterId())
                .orElseThrow(() ->
                    new ResourceNotFoundException("Chapter not found with ID: " + dto.getChapterId()));

        Product product = new Product();

        product.setName(dto.getName());
        product.setSlug(dto.getSlug());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImage(dto.getImage());
        product.setStock(dto.getStock());
        product.setStatus(dto.getStatus());
        product.setSizes(dto.getSizes());
        product.setChapter(chapter);

        if (productRepository.existsBySlug(dto.getSlug())) {
            throw new DuplicateResourceException("Product slug already exists: " + dto.getSlug());
        }
        Product savedProduct = productRepository.save(product);

        return convertToDTO(savedProduct);
    }

    // Get All Products
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Get Product By ID
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException("Product not found with ID: " + id));

        return convertToDTO(product);
    }

    // Update Product
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO dto) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with ID: " + id));

        // 1. Check duplicate slug BEFORE modifying the product
        if (productRepository.existsBySlugAndIdNot(dto.getSlug(), id)) {
            throw new DuplicateResourceException(
                    "Product slug already exists: " + dto.getSlug());
        }

        // 2. Find chapter
        Chapter chapter = chapterRepository.findById(dto.getChapterId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Chapter not found with ID: " + dto.getChapterId()));

        // 3. Update product fields
        product.setName(dto.getName());
        product.setSlug(dto.getSlug());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImage(dto.getImage());
        product.setStock(dto.getStock());
        product.setStatus(dto.getStatus());
        product.setSizes(dto.getSizes());
        product.setChapter(chapter);

        // 4. Save and return DTO
        Product updatedProduct = productRepository.save(product);

        return convertToDTO(updatedProduct);
    }

    // Delete Product
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException("Product not found with ID: " + id));

        productRepository.delete(product);
    }

    // Convert Entity to Response DTO
    private ProductResponseDTO convertToDTO(Product product) {

        ProductResponseDTO dto = new ProductResponseDTO();

        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setImage(product.getImage());
        dto.setStock(product.getStock());
        dto.setStatus(product.getStatus());
        dto.setSizes(product.getSizes());

        Chapter chapter = product.getChapter();

        if (chapter != null) {
            dto.setChapterId(chapter.getId());
            dto.setChapterTitle(chapter.getTitle());

            if (chapter.getSeries() != null) {
                dto.setSeriesId(chapter.getSeries().getId());
                dto.setSeriesTitle(chapter.getSeries().getTitle());
            }
        }

        return dto;
    }
}
