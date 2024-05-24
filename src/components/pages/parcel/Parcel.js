import "./parcel.css";
import * as React from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbar,
} from "@mui/x-data-grid";
import axios from "axios";
import { Button, Stack, buttonBaseClasses } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

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

export default function Parcel() {
  const [userData, setUserData] = React.useState([]);

  const body = { test: "test" };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns = [
    { field: "count", headerName: "#", width: 150 },
    {
      field: "date",
      headerName: "Date",
      width: 300,
    },
    {
      field: "inputId",
      headerName: "Input ID",
      width: 300,
    },
    {
      field: "name",
      headerName: "Merchandiser",
      width: 300,
    },
    {
      field: "UserEmail",
      headerName: "Email",
      width: 300,
    },
    {
      field: "accountNameBranchManning",
      headerName: "Account Name Branch",
      width: 300,
    },
    {
      field: "period",
      headerName: "period",
      width: 300,
    },
    {
      field: "month",
      headerName: "month",
      width: 300,
    },
    {
      field: "week",
      headerName: "week",
      width: 200,
    },
    {
      field: "category",
      headerName: "category",
      width: 200,
      //type: buttonBaseClasses,
    },
    {
      field: "skuDescription",
      headerName: "skuDescription",
      width: 200,
    },
    {
      field: "products",
      headerName: "products",
      width: 200,
    },
    {
      field: "status",
      headerName: "status",
      width: 200,
    },
    {
      field: "beginning",
      headerName: "beginning",
      width: 200,
    },
    {
      field: "delivery",
      headerName: "delivery",
      width: 200,
    },
    {
      field: "inventoryDaysLevel",
      headerName: "inventoryDaysLevel",
      width: 200,
    },
    {
      field: "noOfDaysOOS",
      headerName: "noOfDaysOOS",
      width: 200,
    },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const onClick = (e) => {
          const currentRow = params.row;
          return alert(JSON.stringify(currentRow, null, 4));
        };

        return (
          <Stack>
            <Link
              to={"/view-parcel"}
              state={{ state: params.row.email }}
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained" color="warning" size="small">
                View More
              </Button>
            </Link>
          </Stack>
        );
      },
    },
  ];

  async function getUser() {
    await axios
      .post("http://192.168.50.168:8080/retrieve-parcel-data")
      .then(async (response) => {
        const data = await response.data.data;
        console.log(data, "test");

        const newData = data.map((data, key) => {
          return {
            count: key + 1,
            date: data.date,
            inputId: data.inputId,
            name: data.name,
            UserEmail: data.userEmail,
            accountNameBranchManning: data.accountNameBranchManning,
            period: data.period,
            month: data.month,
            week: data.week,
            category: data.category,
            skuDescription: data.skuDescription,
            products: data.products,
            status: data.status,
            beginning: data.beginning,
            delivery: data.delivery,
            ending: data.ending,
            offtake: data.offtake,
            inventoryDaysLevel: data.inventoryDaysLevel,
            noOfDaysOOS: data.noOfDaysOOS,
          };
        });
        console.log(newData, "testing par");
        setUserData(newData);
      });
  }

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="attendance">
      <div style={{ height: "100%", width: "100%", marginLeft: "100" }}>
        <DataGrid
          rows={userData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          slots={{
            toolbar: CustomToolbar,
          }}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => row.count}
        />
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
