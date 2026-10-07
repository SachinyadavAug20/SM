package com.society.sm.controller;

import com.society.sm.model.Complaint;
import com.society.sm.model.Notice;
import com.society.sm.model.User;
import com.society.sm.service.ComplaintService;
import com.society.sm.service.NoticeService;
import com.society.sm.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final UserService userService;
    private final ComplaintService complaintService;
    private final NoticeService noticeService;

    public MemberController(UserService userService, ComplaintService complaintService, NoticeService noticeService) {
        this.userService = userService;
        this.complaintService = complaintService;
        this.noticeService = noticeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getMember(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<User> payMaintenance(@PathVariable Long id) {
        User updated = userService.payMaintenance(id);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/complaints")
    public ResponseEntity<Complaint> submitComplaint(@RequestBody Complaint complaint) {
        return ResponseEntity.ok(complaintService.createComplaint(complaint));
    }

    @GetMapping("/{id}/complaints")
    public ResponseEntity<List<Complaint>> getComplaints(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintsByMember(id));
    }

    @GetMapping("/notices")
    public ResponseEntity<List<Notice>> getNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }
}
