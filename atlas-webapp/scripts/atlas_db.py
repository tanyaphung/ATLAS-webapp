# Shared MySQL connection for the analytics scripts.
# Credentials come from environment variables set by the Laravel controller,
# so they never appear on the command line (visible to every process via `ps`).
import os
import MySQLdb


def connect():
    return MySQLdb.connect(
        host=os.environ["ATLAS_DB_HOST"],
        user=os.environ["ATLAS_DB_USER"],
        passwd=os.environ["ATLAS_DB_PASSWORD"],
        db=os.environ["ATLAS_DB_NAME"],
    )
