
package com.quietbattles.quietbattles.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.quietbattles.quietbattles.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

	boolean existsBySlug(String slug);
	boolean existsBySlugAndIdNot(String slug, Long id);
}
