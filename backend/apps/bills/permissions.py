from rest_framework.permissions import BasePermission, SAFE_METHODS


class BillPermissions(BasePermission):

    def has_permission(self, request, view):
        print("USER:", request.user.username)
        print("PERMS:", request.user.get_all_permissions())
        if request.method in SAFE_METHODS:
            return True
        
        if request.method == 'POST':
            return request.user.has_perm('bills.add_bills')
        
        if request.method in ('PATCH', 'PUT'):
            return request.user.has_perm('bills.change_bills')
        
        if request.method == "DELETE":
            return request.user.has_perm("bills.delete_bills")

        
