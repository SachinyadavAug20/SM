package com.society.sm.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String flatNumber;

    private String role;

    private Double maintenanceAmount;

    private Boolean maintenancePaid;

    public User() {
    }

    public User(Long id, String name, String email, String password, String flatNumber, String role, Double maintenanceAmount, Boolean maintenancePaid) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.flatNumber = flatNumber;
        this.role = role;
        this.maintenanceAmount = maintenanceAmount;
        this.maintenancePaid = maintenancePaid;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFlatNumber() {
        return flatNumber;
    }

    public void setFlatNumber(String flatNumber) {
        this.flatNumber = flatNumber;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Double getMaintenanceAmount() {
        return maintenanceAmount;
    }

    public void setMaintenanceAmount(Double maintenanceAmount) {
        this.maintenanceAmount = maintenanceAmount;
    }

    public Boolean getMaintenancePaid() {
        return maintenancePaid;
    }

    public void setMaintenancePaid(Boolean maintenancePaid) {
        this.maintenancePaid = maintenancePaid;
    }
}
