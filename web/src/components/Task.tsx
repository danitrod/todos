import { DeleteIcon } from '@chakra-ui/icons';
import { Checkbox, Flex, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';

import TaskService, { ITask } from '../services/Task';
import { prettyDate } from '../utils/date';

interface TaskProps {
  task: ITask;
  refetch: () => void;
}

const Task = ({ task, refetch }: TaskProps): JSX.Element => {
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  return (
    <Flex
      justifyContent="space-between"
      onMouseEnter={() => {
        if (!task.done) {
          setShowDeleteIcon(true);
        }
      }}
      onMouseLeave={() => {
        setShowDeleteIcon(false);
      }}
      p={2}
    >
      <Checkbox
        isChecked={task.done}
        onChange={async () => {
          await TaskService.toggle({ id: task.id, done: !task.done });
          refetch();
        }}
        title={task.finishedAt ? 'Finished at: ' + prettyDate(task.finishedAt) : undefined}
      >
        {task.description}
      </Checkbox>
      {showDeleteIcon && (
        <IconButton
          size="xs"
          aria-label="Delete task"
          variant="ghost"
          icon={<DeleteIcon />}
          onClick={async () => {
            await TaskService.deleteTask({ id: task.id });
            refetch();
          }}
        />
      )}
    </Flex>
  );
};

export default Task;
