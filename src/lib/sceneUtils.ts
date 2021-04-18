import * as THREE from 'three';

export class SceneUtils {

		static createMeshesFromInstancedMesh( instancedMesh: any ) {

			const group = new THREE.Group();
			const count = instancedMesh.count;
			const geometry = instancedMesh.geometry;
			const material = instancedMesh.material;

			for ( let i = 0; i < count; i ++ ) {

				const mesh = new THREE.Mesh( geometry, material );
				instancedMesh.getMatrixAt( i, mesh.matrix );
				mesh.matrix.decompose( mesh.position, mesh.quaternion, mesh.scale );
				group.add( mesh );

			}

			group.copy( instancedMesh );
			group.updateMatrixWorld(); // ensure correct world matrices of meshes

			return group;

		}

		static createMultiMaterialObject( geometry: any, materials: any ) {

			const group = new THREE.Group();

			for ( let i = 0, l = materials.length; i < l; i ++ ) {

				group.add( new THREE.Mesh( geometry, materials[ i ] ) );

			}

			return group;

		}

		static detach( child: any, parent: any, scene: any) {

			console.warn( 'THREE.SceneUtils: detach() has been deprecated. Use scene.attach( child ) instead.' );
			scene.attach( child );

		}

		static attach( child: any, scene: any, parent: any) {

			console.warn( 'THREE.SceneUtils: attach() has been deprecated. Use parent.attach( child ) instead.' );
			parent.attach( child );

		}

}