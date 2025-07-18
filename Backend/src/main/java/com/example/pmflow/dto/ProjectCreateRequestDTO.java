package com.example.pmflow.dto;

import java.util.List;

public class ProjectCreateRequestDTO {
    private String name;
    private String description;
    private Long managerId;
    private List<Long> teamMemberIds;
    private String endDate;  // expected format: mm/dd/yyyy

    public ProjectCreateRequestDTO() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
    }

    public List<Long> getTeamMemberIds() {
        return teamMemberIds;
    }

    public void setTeamMemberIds(List<Long> teamMemberIds) {
        this.teamMemberIds = teamMemberIds;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }
}
