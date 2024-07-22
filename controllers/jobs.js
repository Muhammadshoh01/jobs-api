const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors/index");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ jobs, amount: jobs.length });
};
const getJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const singleJob = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!singleJob) {
    throw new NotFoundError(`There is no job with id ${jobId} `);
  }
  res.status(StatusCodes.OK).json({ singleJob });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    params: { id: jobId },
    user: { userId },
  } = req;
  if (!company || !position) {
    throw new BadRequestError("Company and Position values must be provided");
  }
  const updatedJob = await Job.findOneAndUpdate(
    {
      _id: jobId,
      createdBy: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedJob) {
    throw new NotFoundError(`No job with id ${jobId} `);
  }
  res.status(StatusCodes.OK).json({ updatedJob });
};
const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId} `);
  }
  res.status(StatusCodes.OK).send("Successfully deleted");
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
