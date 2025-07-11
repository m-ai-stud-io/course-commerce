const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// @route   POST api/courses
// @desc    Create a course
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
  // Make sure user is admin
  if (req.user.role !== 'admin') {
    return res.status(401).json({ msg: 'User not authorized' });
  }
  const { title, description, price, image, videoUrl } = req.body;

  try {
    const newCourse = new Course({
      title,
      description,
      price,
      image,
      videoUrl,
    });

    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/courses/:id
// @desc    Update a course
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
  const { title, description, price, image, videoUrl } = req.body;

  // Build course object
  const courseFields = {};
  if (title) courseFields.title = title;
  if (description) courseFields.description = description;
  if (price) courseFields.price = price;
  if (image) courseFields.image = image;
  if (videoUrl) courseFields.videoUrl = videoUrl;

  try {
    let course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Make sure user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: courseFields },
      { new: true }
    );

    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/courses/:id
// @desc    Delete a course
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Make sure user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;