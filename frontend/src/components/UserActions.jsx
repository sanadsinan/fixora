// Badge colours and words for each status
export const userBadge = {
  active: "b ok",
  approved: "b ok",
  pending: "b w",
  rejected: "b x",
  blocked: "b x",
};

export const userLabel = {
  active: "Active",
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
  blocked: "Blocked",
};

function UserActions({ user, approve, reject, block, unblock }) {
  if (user.blocked) {
    return (
      <button className="btn btn-sm" onClick={() => unblock(user.id)}>
        Unblock
      </button>
    );
  }

  if (user.status === "pending") {
    return (
      <div className="action-group">
        <button className="btn btn-sm" onClick={() => approve(user.id)}>
          Approve
        </button>
        <button className="btn btn2 btn-sm" onClick={() => reject(user.id)}>
          Reject
        </button>
      </div>
    );
  }

  return (
    <div className="action-group">
      {user.status === "rejected" && (
        <button className="btn btn-sm" onClick={() => approve(user.id)}>
          Approve
        </button>
      )}
      <button className="btn btn2 btn-sm" onClick={() => block(user.id)}>
        Block
      </button>
    </div>
  );
}

export default UserActions;