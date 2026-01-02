from rest_framework.permissions import BasePermission, SAFE_METHODS


class MenuItemPermission(BasePermission):

    "RBAC for Menu Item Management Section"

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method == "POST":
            return request.user.has_perm("orders.add_menuitem")

        if request.method in ("PUT", "PATCH"):
            return request.user.has_perm("orders.change_menuitem")

        if request.method == "DELETE":
            return request.user.has_perm("orders.delete_menuitem")
        

class OrderPermissions(BasePermission):

    " RBAC for Order Management Section"

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method == "POST":
            return request.user.has_perm("orders.add_order")

        if request.method in ("PUT", "PATCH"):
            return request.user.has_perm("orders.change_order")

        if request.method == "DELETE":
            return request.user.has_perm("orders.delete_order")

        return False
    

class OrderItemPermissions(BasePermission):

    " RBAC for Order Management Section"

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        if request.method == "POST":
            return request.user.has_perm("orders.add_orderitem")

        if request.method in ("PUT", "PATCH"):
            return request.user.has_perm("orders.change_orderitem")

        if request.method == "DELETE":
            return request.user.has_perm("orders.delete_orderitem")

        return False

