from rest_framework.permissions import BasePermission, SAFE_METHODS


class TablePermissions(BasePermission):

    "RBAC for Table Management Section"

    def has_permission(self, request, view):
        print("USER:", request.user.username)
        print("PERMS:", request.user.get_all_permissions())

        if request.method in SAFE_METHODS:
            return True
        if request.method == 'POST':
            return request.user.has_perm("table.add_table")
        
        if request.method in ("PUT", "PATCH"):
            return request.user.has_perm("table.change_table")
        
        if request.method == "DELETE":
            return request.user.has_perm("table.delete_table")
        
        return False


