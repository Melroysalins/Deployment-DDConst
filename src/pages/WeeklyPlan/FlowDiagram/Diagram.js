import { Handle, Position, ReactFlow } from 'reactflow';
import { Box, Button, Container, FormControl, TextField } from '@mui/material';
import 'reactflow/dist/style.css';
import styled from '@emotion/styled';

const Section = Box;
const Row = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: '20px',
  height: 'auto',
});
const StyledButton = Button;

const CustomNode1 = ({ data }) => {
  return (
    <>
      <Box sx={{ padding: '3px 3px', border: '1px solid black', borderRadius: '20px' }}>
        {data.label}
      </Box>

      <Handle type="target" position={Position.Bottom} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const CustomNode2 = ({ data }) => {
  return (
    <>
      <Box sx={{ padding: '3px 15px', border: '1px solid black', borderRadius: '10px' }}>
        {data.label}
      </Box>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
};

const nodeTypes = { custom1: CustomNode1, custom2: CustomNode2 };

const initialNodes = [
  { id: '1', type: 'custom1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', type: 'custom2', position: { x: 100, y: 100 }, data: { label: '2' } },
  { id: '3', type: 'custom2', position: { x: 200, y: 100 }, data: { label: '3' } },
  { id: '4', type: 'custom1', position: { x: 300, y: 0 }, data: { label: '4' } },
];
const initialEdges = [
  { type: 'step', id: 'e1-2', source: '1', target: '2' },
  { type: 'step', id: 'e2-3', source: '2', target: '3' },
  { type: 'step', id: 'e3-4', source: '3', target: '4' },
];

function Diagram() {
  return (
    <Container>
      <Section>
        <Row>
          <StyledButton>
            <FormControl>
              <TextField id="power-ss-input" label="Power S/S" size="small" sx={{ width: '100%', '& .MuiInputBase-root': {
                height: '20px',
                width: '100%',
              }, }} autoComplete="off" />
            </FormControl>
          </StyledButton>
          <StyledButton>
            <FormControl>
              <TextField id="new-cv-section-input" label="New CV Section (Installation)" size="small" sx={{ width: '100%', '& .MuiInputBase-root': {
                height: '20px',
                width: '100%',
              }, }} autoComplete="off" />
            </FormControl>
          </StyledButton>
          <StyledButton>
            <FormControl>
              <TextField id="tr-input" label="T/R" size="small" sx={{ width: '100%', '& .MuiInputBase-root': {
                height: '20px',
                width: '100%',
              }, }} autoComplete="off" />
            </FormControl>
          </StyledButton>
        </Row>
        <Box sx={{ alignSelf: 'stretch', height: '177px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
          <ReactFlow nodes={initialNodes} edges={initialEdges} nodeTypes={nodeTypes} />
        </Box>
      </Section>
    </Container>
  );
}

export default Diagram;
