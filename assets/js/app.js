(function () {
  const data = window.projectData || {};
  const photoKey = data.photoKey || 'portfolio_photo';

  function initThreeScene() {
    const stage = document.querySelector("#three-stage");
    if (!stage || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.2, 7.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    
    // Size perfectly to the container
    const width = stage.clientWidth || 300;
    const height = stage.clientHeight || 300;
    renderer.setSize(width, height);
    
    stage.appendChild(renderer.domElement);
    stage.classList.add("is-ready");

    const group = new THREE.Group();
    scene.add(group);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.7, 2),
      new THREE.MeshBasicMaterial({ color: 0x7a3dff, wireframe: true, transparent: true, opacity: 0.6 }),
    );
    group.add(wire);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.25, 0.018, 12, 120),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }),
    );
    ring.rotation.x = Math.PI / 2.7;
    group.add(ring);

    const colors = [0x7a3dff, 0xed52cb, 0x3b89ff, 0xff6b00, 0x00d722];
    const nodes = colors.map((color, index) => {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(index === 4 ? 0.16 : 0.12, 24, 24),
        new THREE.MeshBasicMaterial({ color }),
      );
      const angle = (index / colors.length) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 2.25, Math.sin(angle) * 1.1, Math.sin(angle) * 1.2);
      group.add(node);
      return node;
    });

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16 });
    nodes.forEach((node) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), node.position]);
      group.add(new THREE.Line(geometry, lineMaterial));
    });

    let targetX = 0;
    let targetY = 0;

    function resize() {
      if (!stage) return;
      const bounds = stage.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }

    function animate(time) {
      const t = time * 0.001;
      group.rotation.x += (targetY - group.rotation.x) * 0.025;
      group.rotation.y += (targetX + t * 0.28 - group.rotation.y) * 0.025;
      wire.rotation.z = t * 0.22;
      ring.rotation.z = t * 0.36;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    stage.addEventListener("pointermove", (event) => {
      const bounds = stage.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.8;
      targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.5;
    });

    window.addEventListener("resize", resize);
    // Initial wait for CSS to apply dimensions
    setTimeout(resize, 100);
    requestAnimationFrame(animate);
  }

  // Only run what we need for the current page
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
  } else {
    initThreeScene();
  }
})();
