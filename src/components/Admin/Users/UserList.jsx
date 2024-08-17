import PropTypes from "prop-types";
import UserCard from "./UserCard";

const UserList = (props) => {
  const { filteredUsers, filter } = props;
  return (
    <ul className="user-list">
      {filteredUsers ? (
        filteredUsers.map((user) => (
          <UserCard user={user} filter={filter} key={user.id} />
        ))
      ) : (
        <div>No hay usuarios encontrados</div>
      )}
    </ul>
  );
};

UserList.propTypes = {
  filteredUsers: PropTypes.arrayOf(PropTypes.object),
  filter: PropTypes.string.isRequired,
};

export default UserList;
