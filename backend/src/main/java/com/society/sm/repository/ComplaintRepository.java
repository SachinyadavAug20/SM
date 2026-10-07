package com.society.sm.repository;

import com.society.sm.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findAllByOrderByIdDesc();
    List<Complaint> findByMemberIdOrderByIdDesc(Long memberId);
}
