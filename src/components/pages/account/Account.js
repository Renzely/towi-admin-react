import "./account.css";
import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbar,
} from "@mui/x-data-grid";
import axios, { isAxiosError } from "axios";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDemoData } from "@mui/x-data-grid-generator";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function Account() {
  const { data, loading } = useDemoData({
    dataSet: "Commodity",
    rowLength: 4,
    maxColumns: 6,
  });

  const [userData, setUserData] = React.useState([]);

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const [updateStatus, setUpdateStatus] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  var test = "testing";

  const requestBody = { isActivate: updateStatus, emailAddress: userEmail };

  const [modalFullName, setModalFullName] = React.useState("");
  const [modalBranch, setModalBranch] = React.useState("");
  const [modalEmail, setModalEmail] = React.useState("");
  const [modalPhone, setModalPhone] = React.useState("");

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const columns = [
    { field: "count", headerName: "#", width: 150 },
    { field: "firstName", headerName: "First name", width: 200 },
    { field: "lastName", headerName: "Last name", width: 200 },
    {
      field: "emailAddress",
      headerName: "Email",
      width: 250,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 200,
    },
    {
      field: "contactNum",
      headerName: "Contact Number",
      width: 200,
    },
    {
      field: "Branch",
      headerName: "Account Name Branch",
      width: 250,
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 180,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const status = params.row.isActive;
        const rowEmail = params.row.emailAddress;
        const onClick = (e) => {
          {
            status ? setUpdateStatus(false) : setUpdateStatus(true);
          }
          setUserEmail(rowEmail);
          handleOpenDialog();
        };

        return (
          <>
            {status ? (
              <Stack>
                <ColorButton
                  variant="contained"
                  size="small"
                  style={{ width: "50%", marginTop: "13px" }}
                  onClick={onClick}
                >
                  Active
                </ColorButton>
              </Stack>
            ) : (
              <Stack>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ width: "50%", marginTop: "13px" }}
                  onClick={onClick}
                >
                  Inactive
                </Button>
              </Stack>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 90,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const onClick = (e) => {
          let mFullname = params.row.firstName + " " + params.row.lastName;
          //let condition = params.row.middle_name;
          let mBranch = params.row.Branch;
          let mEmail = params.row.emailAddress;
          let mPhone = params.row.contactNum;
          // if (condition === "Null") {
          //   mFullname = params.row.firstName + " " + params.row.lastName;
          // } else {
          //   mFullname =
          //     params.row.first_name +
          //     " " +
          //     params.row.middle_name +
          //     " " +
          //     params.row.last_name;
          // }

          setModalFullName(mFullname);
          setModalBranch(mBranch);
          setModalEmail(mEmail);
          setModalPhone(mPhone);

          return handleOpen();
        };

        return (
          <Stack>
            <Button
              variant="contained"
              size="small"
              color="info"
              onClick={onClick}
              style={{ width: "50%", marginTop: "13px" }}
            >
              View
            </Button>
          </Stack>
        );
      },
    },
  ];

  async function getUser() {
    await axios
      .post("http://192.168.50.168:8080/get-all-user", requestBody)
      .then(async (response) => {
        const data = await response.data.data;

        const newData = data.map((data, key) => {
          return {
            count: key + 1,
            remarks: data.remarks,
            firstName: data.firstName,
            //middle_name: data.middle_name ? data.middle_name : "Null",
            lastName: data.lastName,

            Branch: data.accountNameBranchManning,
            emailAddress: data.email_Address,
            //address: data.address,
            contactNum: data.contactNum,
            isActive: data.isActivate,
          };
        });
        console.log(newData, "testing par");
        setUserData(newData);
      });
  }

  async function setStatus() {
    console.log("check body", requestBody);
    await axios
      .put("http://192.168.50.168:8080/update-status", requestBody)
      .then(async (response) => {
        const data = await response.data.data;

        console.log(data);
        window.location.reload();
      });
  }

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="account">
      <div style={{ height: "100%", width: "100%", marginLeft: "100" }}>
        <DataGrid
          rows={userData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                address: false,
                phone: false,
              },
            },
          }}
          slots={{
            toolbar: CustomToolbar,
          }}
          //   slots={{ toolbar: GridToolbar }}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => row.count}
          disableRowSelectionOnClick
        />
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Full Details :{/* <HighlightOffIcon/> */}
            {/* {test} */}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <span className="detailTitle">Full name:</span>{" "}
            <span className="detailDescription">{modalFullName}</span>
            <br></br>
            <span className="detailTitle">Email:</span>{" "}
            <span className="detailDescription">{modalEmail}</span>
            <br></br>
            <span className="detailTitle">Contact Number:</span>{" "}
            <span className="detailDescription">{modalPhone}</span>
            <br></br>
            <span className="detailTitle">Account Branch Name:</span>{" "}
            <span className="detailDescription">{modalBranch}</span>
            <br></br>
          </Typography>
          <Stack>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Stack>
        </Box>
      </Modal>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Account Activation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {updateStatus
              ? "Are you sure you want to set this user as active?"
              : "Are you sure you want to set this user as inactive?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={setStatus} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const ColorButton = styled(Button)(({ theme }) => ({
  color: "#000",
  backgroundColor: "#F6FAB9",
  "&:hover": {
    backgroundColor: "#CAE6B2",
  },
}));
