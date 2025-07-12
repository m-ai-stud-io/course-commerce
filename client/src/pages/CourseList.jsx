import React, { useState, useEffect } from 'react';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Available Courses</h2>
      <div style={styles.courseList}>
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id} style={styles.courseCard}>
              <h3 style={styles.courseTitle}>{course.title}</h3>
              <p style={styles.courseDescription}>{course.description}</p>
              <p style={styles.coursePrice}>Price: ${course.price}</p>
              <img src={course.image} alt={course.title} style={styles.courseImage} />
              <p style={styles.courseVideoUrl}>Video: <a href={course.videoUrl} target="_blank" rel="noopener noreferrer">Link</a></p>
            </div>
          ))
        ) : (
          <p>No courses available yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f7f6',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  courseList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  courseCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  courseImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginBottom: '15px',
  },
  courseTitle: {
    color: '#007bff',
    marginBottom: '10px',
  },
  courseDescription: {
    color: '#555',
    fontSize: '14px',
    marginBottom: '10px',
  },
  coursePrice: {
    color: '#28a745',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  courseVideoUrl: {
    fontSize: '14px',
    marginBottom: '15px',
  },
};

export default CourseList;