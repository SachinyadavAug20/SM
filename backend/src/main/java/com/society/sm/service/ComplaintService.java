package com.society.sm.service;

import com.society.sm.model.Complaint;
import com.society.sm.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public Complaint createComplaint(Complaint complaint) {
        complaint.setStatus("PENDING");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        complaint.setCreatedAt(LocalDateTime.now().format(formatter));
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByIdDesc();
    }

    public List<Complaint> getComplaintsByMember(Long memberId) {
        return complaintRepository.findByMemberIdOrderByIdDesc(memberId);
    }

    public Complaint updateStatus(Long id, String status) {
        Optional<Complaint> optionalComplaint = complaintRepository.findById(id);
        if (optionalComplaint.isPresent()) {
            Complaint complaint = optionalComplaint.get();
            complaint.setStatus(status);
            return complaintRepository.save(complaint);
        }
        return null;
    }
}
