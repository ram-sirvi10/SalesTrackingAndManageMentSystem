package com.company.salestracker.mapper;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;

import com.company.salestracker.dto.request.LeadRequest;
import com.company.salestracker.dto.request.TargetRequest;
import com.company.salestracker.dto.request.UserRequest;
import com.company.salestracker.dto.response.DealResponse;
import com.company.salestracker.dto.response.LeadResponse;
import com.company.salestracker.dto.response.PaginationResponse;
import com.company.salestracker.dto.response.PermissionResponse;
import com.company.salestracker.dto.response.RoleResponse;
import com.company.salestracker.dto.response.SaleResponse;
import com.company.salestracker.dto.response.TargetResponse;
import com.company.salestracker.dto.response.UserResponse;
import com.company.salestracker.entity.Deal;
import com.company.salestracker.entity.Lead;
import com.company.salestracker.entity.LeadStatus;
import com.company.salestracker.entity.Permission;
import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.Sale;
import com.company.salestracker.entity.Target;
import com.company.salestracker.entity.User;

public class Mapper {

	public static User toEntity(UserRequest request, Set<Role> roles) {

		if (request == null)
			return null;

		return User.builder().name(request.getName()).email(request.getEmail()).phone(request.getPhone())
				.password(request.getPassword()).roles(roles).build();
	}

	public static UserResponse toResponse(User user) {

		if (user == null)
			return null;

		return UserResponse.builder().id(user.getId()).name(user.getName()).email(user.getEmail())
				.phone(user.getPhone()).status(user.getStatus().name()).roles(toRoleResponseSet(user.getRoles()))
				.build();
	}

	public static RoleResponse toResponse(Role role) {

		if (role == null)
			return null;

		return RoleResponse.builder().id(role.getId()).roleName(role.getRoleName()).description(role.getDescription())
				.permissions(toPermissionResponseSet(role.getPermissions())).build();
	}

	public static PermissionResponse toResponse(Permission permission) {

		if (permission == null)
			return null;

		return PermissionResponse.builder().id(permission.getId()).permissionCode(permission.getPermissionCode())
				.description(permission.getDescription()).build();
	}

	public static LeadResponse toResponse(Lead lead) {
		if (lead == null)
			return null;
		return LeadResponse.builder().leadId(lead.getId()).name(lead.getName()).email(lead.getEmail())
				.phone(lead.getPhone()).assignedToId(lead.getAssignedto() != null ? lead.getAssignedto().getId() : null)
				.assignedPersonEmail(lead.getAssignedto() != null ? lead.getAssignedto().getEmail() : null)

				.source(lead.getSource()).createdAt(lead.getCreatedAt()).build();
	}

	public static Lead toEntity(LeadRequest lead) {
		if (lead == null)
			return null;
		return Lead.builder().name(lead.getName()).email(lead.getEmail()).source(lead.getSource())
				.phone(lead.getPhone()).status(LeadStatus.NEW).assignedto(null).build();
	}

	public static DealResponse toResponse(Deal deal) {

		return DealResponse.builder().dealId(deal.getId()).lead(toResponse(deal.getLead()))
				.assignedUserId(deal.getAssignedTo() != null ? deal.getAssignedTo().getId() : null)
				.assignedUserEmail(deal.getAssignedTo() != null ? deal.getAssignedTo().getEmail() : null)
				.dealStage(deal.getDealStage().name()).expectedAmount(deal.getExpectedAmount())
				.closingDate(deal.getClosingDate()).createdAt(deal.getCreatedAt()).build();
	}

	public static SaleResponse toResponse(Sale sale) {
		return SaleResponse.builder().id(sale.getId()).dealId(sale.getDeal() != null ? sale.getDeal().getId() : null)
				.saleAmount(sale.getSaleAmount())
				.dealAssignedUser(sale.getDeal() != null && sale.getDeal().getAssignedTo() != null
						? sale.getDeal().getAssignedTo().getEmail()
						: null)
				.paymentStatus(sale.getPaymentStatus() != null ? sale.getPaymentStatus().name() : null)
				.invoiceNumber(sale.getInvoiceNumber()).saleDate(sale.getSaleDate())
				.createdByUserEmail(sale.getCreatedBy() != null ? sale.getCreatedBy().getEmail() : null).build();
	}

	public static Set<RoleResponse> toRoleResponseSet(Set<Role> roles) {

		if (roles == null)
			return null;
		return roles.stream().map(Mapper::toResponse).collect(Collectors.toSet());
	}

	public static Set<PermissionResponse> toPermissionResponseSet(Set<Permission> permissions) {

		if (permissions == null)
			return null;

		return permissions.stream().map(Mapper::toResponse).collect(Collectors.toSet());
	}

	public static Target toEntity(TargetRequest request, User user) {
		return Target.builder().user(user).targetMonth(request.getTargetMonth()).targetYear(request.getTargetYear())
				.targetAmount(request.getTargetAmount()).build();
	}

	public static TargetResponse toResponse(Target target) {

	   

	        return TargetResponse.builder()
	                .id(target.getId())
	                .userId(target.getUser().getId())
	                .userEmail(target.getUser().getEmail())
	                .userName(target.getUser().getName())
	                .targetMonth(target.getTargetMonth())
	                .targetYear(target.getTargetYear())
	                .targetAmount(target.getTargetAmount())
	             
	                .build();
	    }

	public static <T> PaginationResponse<T> toPaginationResponse(Page<T> page) {
		return PaginationResponse.<T>builder().content(page.getContent()).pageNumber(page.getNumber())
				.pageSize(page.getSize()).totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
				.lastPage(page.isLast()).firstPage(page.isFirst()).build();
	}

}
