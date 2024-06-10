import { useState } from "react";
import {
	AccordionDetails as MuiAccordionDetails, 
	Accordion as MuiAccordion, 
	AccordionSummary as MuiAccordionSummary, 
	Button,
	Box, 
	Stack,
	FormControlLabel,
	Switch,
	Typography,
} from "@mui/material"; 
import { styled } from "@mui/system";
import PropTypes from 'prop-types';
import Iconify from 'components/Iconify';
import Diagram from "./Diagram";
import FormDiagram from "./FormDiagram";

const StyledButtonContainer = styled(Box)({
alignSelf: "stretch",
display: "flex",
flexDirection: "column",
alignItems: "flex-start",
justifyContent: "flex-start",
gap: "10px",
padding: "24px",
maxWidth: "1752px",
});

const Container1 = styled('div')({
	alignSelf: 'stretch',
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
  });

const StyledButtonRow = styled(Box)({
display: "flex",
flexDirection: "row",
alignItems: "flex-start",
justifyContent: "flex-start",
minWidth: "293px",
height: "48px",
gap: "8px",
});

const LeftContent = styled(Box)({
	maxWidth: "1339px",
	gap: "16px",
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	fontFamily: "Manrope",
	"@media (max-width: 1440px)": {
		maxWidth: "1119px",
	},
});

const CableContent = styled(Box)({
	height: "48px",
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "flex-start",
	gap: "8px",
	minWidth: "354px",
	maxWidth: "100%",
	fontSize: "18px",
	fontFamily: "Manrope",
	fontWeight: "500",
	"@media (max-width: 1440px)": {
		minWidth: "294px",
		fontSize: "14px",
	},
});

const RightContent = styled(Box)({
	display: "flex",
	flexDirection: "row",
	alignItems: "flex-start",
	justifyContent: "flex-end",
	gap: "8px",
	fontFamily: "Manrope",
	"@media (max-width: 1440px)": {
		gap: "6px",
	},
});

const StyledButton = styled(Button)({
	minWidth: "79px",
	height: "48px",
	borderRadius: "8px",
	padding: "12px 16px 12px 16px",
	border: "1px solid rgba(0, 0, 0, 0.1)",
	flex: "1",
	gap: "8px",
	"@media (max-width: 1440px)": {
		minWidth: "50px",
		height: "35px",
		padding: "8px 12px 8px 12px",
		fontSize: "10px",
	},
});

const CustomButtonRoot = styled(Button)({
textDecoration: "none",
borderRadius: "8px",
backgroundColor: "white",
border: "1px solid rgba(0, 0, 0, 0.1)",
boxSizing: "border-box",
Width: "1664px",
overflow: "hidden",
display: "flex",
flexDirection: "column",
alignItems: "flex-start",
justifyContent: "flex-start",
position: "relative",
gap: "10px",
fontFamily: "Manrope",
});

const CustomButton = styled(CustomButtonRoot)({
display: "flex",
flexDirection: "row",
alignItems: "center",
justifyContent: "flex-start",
padding: "0px 24px",
position: "relative",
gap: "16px",
width: "100%",
height: "64px",
fontSize: "18px",
fontFamily: "Manrope",
});

const CustomButtonText = styled('span')({
flex: "1",
position: "relative",
lineHeight: "24px",
fontWeight: "600",
color: "#919eab",
zIndex: "2",
textAlign: "left",
fontFamily: "Manrope",
});

const DiagramParent = styled('div')({
	borderRadius: 8,
	backgroundColor: '#fff',
	border: '1px solid rgba(0, 0, 0, 0.1)',
	boxSizing: 'border-box',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	width: '41.5%',
});

const TableParent = styled('div')({
	width: '58%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end',
	justifyContent: 'flex-start',
	"@media (max-width: 1440px)": {
	},
});

const Content = styled('div')({
	width: '100%',
	height: '584.41px',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	gap: '16px',
	"@media (max-width: 1440px)": {
		width: '100%',
		height: '450.41px',
	},
	});
  
const ContentParentRoot = styled('div')({
	maxWidth: '100%',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	textAlign: 'left',
	fontSize: '14px',
	color: '#fff',
	fontFamily: 'Manrope',
  });
  
const DiagramHeader = styled('Box')({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	justifyContent: 'flex-end',
	width: '100%',
	height: '44px',
	padding: '12px 12px 0px',
	boxSizing: 'border-box',
	"@media (max-width: 1440px)": {
		width: '100%',
		height: '30.14px',
		padding: '8px 8px 0px',
	},
});

const Tables = styled('div')({
	alignSelf: 'stretch',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-end',
	justifyContent: 'flex-start',
	overflow: 'scroll',
});

const ConnectionInstallationTable = styled('div')({
	alignSelf: 'auto',
	display: 'flex',
	flex: '1 1 auto',
	flexDirection: 'row',
	flexWrap: 'wrap',
	alignItems: 'flex-start',
	justifyContent: 'flex-start',
	gap: '16px',
	borderRadius: '8px',
	backgroundColor: '#fff',
	boxSizing: 'border-box',
});

const Accordion = styled((props) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	border: "1px solid rgba(0, 0, 0, 0.1)",
	overflow: "hidden",
	borderRadius: "12px",
	width: "1704px",
	padding: "24px 16px 24px 16px",
	gap: "16px",
	"&:not(:last-child)": {
		borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
	},
	fontFamily: "Manrope",
	"@media (max-width: 1440px)": {
		padding: "14px 10px 14px 10px",
	},
}));

const AccordionSummary = styled((props) => (
	<MuiAccordionSummary {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	"& .Mui-expanded": {
		borderTopLeftRadius: "8px",
		borderTopRightRadius: "8px",
	},
	"& .MuiAccordionSummary-expandIconWrapper": {
		position: "absolute",
		left: "0",
		marginLeft: "0",
	},
	fontFamily: "Manrope",
	height: "48px",
	padding: "0px",
}));

const AccordionDetails = styled((props) => (
	<MuiAccordionDetails {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	padding: "0px",
	fontFamily: "Manrope",
}));

const Tasks = ({
	isEditable,
	cancel = true,
	delete1 = true,
	save = true,
}) => {


const [expanded, setExpanded] = useState('panel1');
const [panels, setPanels] = useState([1]);
const [showDemolitionTable, setShowDemolitionTable] = useState(false);
const [isEditing, setIsEditing] = useState(false);

const handleChange = (panel) => (event, isExpanded) => {
	setExpanded(isExpanded ? panel : false);
};

const addPanel = () => {
	setPanels(prevPanels => [...prevPanels, prevPanels.length + 1]);
	setExpanded(`panel${panels.length + 1}`);
};

const handleCancelButtonClick = (event) => {
	event.stopPropagation();
	setIsEditing(false);
};

const handleDeleteButtonClick = (event) => {
	event.stopPropagation();
};

const handleSaveButtonClick = (event) => {
	event.stopPropagation();
};

const handleEditButtonClick = (event) => {
	event.stopPropagation();
  	setIsEditing(true);
};


return (
	<StyledButtonContainer>
		{panels.map((panel, index) => (
			<ContentParentRoot key={index}>
				<Accordion expanded={expanded === `panel${panel}`} onChange={handleChange(`panel${panel}`)} key={index}>
					<AccordionSummary
						expandIcon={<Iconify icon="material-symbols:expand-more-rounded" width={20} height={20} />}
						aria-controls={`panel${panel}-content`}
						id={`panel${panel}-header`}
					>
						<Stack gap={2} direction="row" alignItems="center" sx={{ width: "100%"}} justifyContent={ "space-between" }>
							<LeftContent sx={{ position: 'relative', left: '2rem', textAlign: 'center'}}>
								<CableContent >Cable Name:<span style={{ fontWeight: '600'}}>154kV Namyang - Yeonsu T/L</span></CableContent>					
								<CableContent >Cable Name:<span>154kV Namyang - Yeonsu T/L</span></CableContent>					
							</LeftContent>
							<RightContent>
								{isEditing ? (
									<>
										<StyledButton
											onClick={handleCancelButtonClick}
											style={{ boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.04)" }}
											variant="outlined"
											sx={{ 
												borderRadius: "8px", 
												backgroundColor: "#FFFFFF",
											}}
										>
											Cancel
										</StyledButton>
										<StyledButton
											onClick={handleDeleteButtonClick}
											style={{ boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.04)" }}
											variant="outlined"
											sx={{ 
												borderRadius: "8px", 
												backgroundColor: "#FFFFFF",
											}}
										>
											<Stack gap={1} direction="row" alignItems="center">
												<Iconify icon="mi:delete" width={20} height={20} />
												Delete
											</Stack>
										</StyledButton>
										<StyledButton
											onClick={handleSaveButtonClick}
											style={{ boxShadow: "0px 8px 16px rgba(141, 153, 255, 0.24)" }}
											variant="contained"
											sx={{ 
												borderRadius: "8px", 
												backgroundColor: "#8D99FF",
											}}
										>
											<Iconify icon="heroicons-outline:save" width={20} height={20} />
											Save
										</StyledButton>
									</>
								) : (
									<>
										<StyledButton
											onClick={handleDeleteButtonClick}
											style={{ boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.04)" }}
											variant="outlined"
											sx={{ 
												borderRadius: "8px", 
												backgroundColor: "#FFFFFF",
											}}
										>
											<Stack gap={1} direction="row" alignItems="center">
												<Iconify icon="mi:delete" width={20} height={20} />
												Delete
											</Stack>
										</StyledButton>
										<StyledButton
											onClick={handleEditButtonClick}
											style={{ boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.04)" }}
											variant="outlined"
											sx={{ 
												width: "150px",
												borderRadius: "8px", 
												backgroundColor: "#FFFFFF",
											}}
										>
											<Stack gap={1} direction="row" alignItems="center">
												<Iconify icon="mi:delete" width={20} height={20} />
												Edit Diagram
											</Stack>
										</StyledButton>
									</>
								)}
								<img
									sx={{
										width: "40px",
										borderRadius: "8px",
										height: "96px",
										objectFit: "contain",
									}}
									alt=""
									src="/button@2x.png"
								/>

							</RightContent>
						</Stack>
					</AccordionSummary>
					<AccordionDetails>
						<Content>
							<DiagramParent>
								<DiagramHeader>
									<Button sx={{ backgroundColor: '#F3F3F5', color: "#596570", display: "flex", gap: "4px", padding: "0px 12px 0px 12px", height: "32px" }}>
									<Iconify icon="ic:baseline-cached" width={16} height={16} />
									Update
									</Button>
								</DiagramHeader>
								<Container1>
									<Diagram />
								</Container1>
							</DiagramParent>
							<TableParent>
								<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '8px 0px' }}>
									<FormControlLabel control={<Switch checked={showDemolitionTable} onChange={() => setShowDemolitionTable(prev => !prev)} color="primary" />} label="Demolition" sx={{ color: 'black', fontFamily: 'Manrope, sans-serif' }} />
								</Box>
								<Tables>
									<ConnectionInstallationTable>
										{isEditable && (
											<>
												<FormDiagram
													showDemolitionTable={showDemolitionTable}
													isEdit={isEditing}
													setIsEditing={setIsEditing}
												/>
											</>
										)}

									</ConnectionInstallationTable>
								</Tables>
							</TableParent>
						</Content>
					</AccordionDetails>
				<Box
					sx={{
						position: "absolute",
						top: "0",
						left: "0",
						width: "4px",
						height: "100%",
						zIndex: "0",
						backgroundColor: "#8D99FF",
						borderTopLeftRadius: "8px",
						borderBottomLeftRadius: "8px",
					}} 
				/>
				</Accordion>
				{expanded === `panel${panel}` && (
					<Box
						sx={{
							minHeight: '96px',
							width: '100%',
							maxWidth: '28px', 
							borderRadius: '0px 8px 8px 0px',
							backgroundColor: '#ffa58d',
							display: 'flex',
							alignItems: 'center', 
							justifyContent: 'center', 
							padding: '16px 2px',
							boxSizing: 'border-box',
						}}
					>
						<Typography
							sx={{
							writingMode: 'vertical-rl', 
							fontWeight: '600',
							color: '#fff',
							}}
						>
							Summary
						</Typography>
					</Box>
				)}
			</ContentParentRoot>
		))}
		<CustomButton onClick={addPanel}>
			<Iconify icon="ic:round-plus" width={20} height={20} />
			<CustomButtonText>Add Diagram</CustomButtonText>
		</CustomButton>
		<StyledButtonRow sx={{ paddingTop: '8px'}}>
			<StyledButton
				variant="contained"
				sx={{ marginRight: "16px", borderRadius: "8px", backgroundColor: "#8D99FF", width: "200px", height: "40px" }}
			>
				<Iconify icon="heroicons-outline:save" width={20} height={20} />
				Save
			</StyledButton>
			<StyledButton
				variant="contained"
				sx={{ borderRadius: "8px", backgroundColor: "#FFA58D", width: "200px", height: "40px"}}
			>
				Continue
				<Iconify icon="lucide:arrow-right" width={20} height={20} />
			</StyledButton>
		</StyledButtonRow>
	</StyledButtonContainer>
);
};

Tasks.propTypes = {
isEditable: PropTypes.bool,
cancel: PropTypes.bool,
delete1: PropTypes.bool,
save: PropTypes.bool,
};

export default Tasks;
