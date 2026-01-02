import secrets
import string


def genrate_order_id(length=8):

    digits = string.digits
    first_two_chars = "OID"

    remainig_chars = "".join(secrets.choice(digits) for i in range(length-3))

    order_id = first_two_chars