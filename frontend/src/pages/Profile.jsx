import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  Card,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import "./Profile.css";
import ChangePasswordModal from "../components/ChangePasswordModal";
import EditProfileDrawer from "../components/EditProfileDrawer";

const Profile = () => {
  const { user } = useSelector((state) => state.usersState);
  const [key, setKey] = useState("overview");
  const [showDrawer, setShowDrawer] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleDrawerOpen = () => setShowDrawer(true);
  const handleDrawerClose = () => setShowDrawer(false);

  return (
    <motion.div
      className="py-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="profile-card shadow border-0 p-4 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* User Info */}
                <h4 className="mb-2">{user?.fullname?.toUpperCase()}</h4>
                <p className="text-muted small mb-3 mt-3">{user?.email}</p>

                <Button
                  variant="outline-primary"
                  size="sm"
                  className="mb-4"
                  onClick={handleDrawerOpen}
                >
                  Edit Profile
                </Button>

                {/* Tabs */}
                <Tabs
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="profile-tabs"
                  fill
                >
                  <Tab eventKey="overview" title="Overview">
                    <motion.div
                      className="mt-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p>
                        <strong>Email:</strong> {user?.email}
                      </p>
                    </motion.div>
                  </Tab>

                  <Tab eventKey="security" title="Security">
                    <motion.div
                      className="mt-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h5 className="mb-3">Change Your Password</h5>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowChangePassword(true)}
                      >
                        Change Password
                      </Button>
                    </motion.div>
                  </Tab>
                </Tabs>
              </motion.div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Drawers and Modals */}
      <EditProfileDrawer
        show={showDrawer}
        handleClose={handleDrawerClose}
        user={user}
      />

      <AnimatePresence>
        {showChangePassword && (
          <ChangePasswordModal
            show={showChangePassword}
            handleClose={() => setShowChangePassword(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
