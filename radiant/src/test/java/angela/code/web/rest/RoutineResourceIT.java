package angela.code.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import angela.code.IntegrationTest;
import angela.code.domain.Routine;
import angela.code.domain.enumeration.RoutineType;
import angela.code.repository.RoutineRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RoutineResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class RoutineResourceIT {

    private static final LocalDate DEFAULT_SELECTED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_SELECTED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final RoutineType DEFAULT_ROUTINE_TYPE = RoutineType.MORNING;
    private static final RoutineType UPDATED_ROUTINE_TYPE = RoutineType.EVENING;

    private static final String ENTITY_API_URL = "/api/routines";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RoutineRepository routineRepository;

    @Mock
    private RoutineRepository routineRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRoutineMockMvc;

    private Routine routine;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Routine createEntity(EntityManager em) {
        Routine routine = new Routine().selectedDate(DEFAULT_SELECTED_DATE).routineType(DEFAULT_ROUTINE_TYPE);
        return routine;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Routine createUpdatedEntity(EntityManager em) {
        Routine routine = new Routine().selectedDate(UPDATED_SELECTED_DATE).routineType(UPDATED_ROUTINE_TYPE);
        return routine;
    }

    @BeforeEach
    public void initTest() {
        routine = createEntity(em);
    }

    @Test
    @Transactional
    void createRoutine() throws Exception {
        int databaseSizeBeforeCreate = routineRepository.findAll().size();
        // Create the Routine
        restRoutineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(routine)))
            .andExpect(status().isCreated());

        // Validate the Routine in the database
        List<Routine> routineList = routineRepository.findAll();
        assertThat(routineList).hasSize(databaseSizeBeforeCreate + 1);
        Routine testRoutine = routineList.get(routineList.size() - 1);
        assertThat(testRoutine.getSelectedDate()).isEqualTo(DEFAULT_SELECTED_DATE);
        assertThat(testRoutine.getRoutineType()).isEqualTo(DEFAULT_ROUTINE_TYPE);
    }

    @Test
    @Transactional
    void createRoutineWithExistingId() throws Exception {
        // Create the Routine with an existing ID
        routine.setId(1L);

        int databaseSizeBeforeCreate = routineRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRoutineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(routine)))
            .andExpect(status().isBadRequest());

        // Validate the Routine in the database
        List<Routine> routineList = routineRepository.findAll();
        assertThat(routineList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRoutines() throws Exception {
        // Initialize the database
        routineRepository.saveAndFlush(routine);

        // Get all the routineList
        restRoutineMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(routine.getId().intValue())))
            .andExpect(jsonPath("$.[*].selectedDate").value(hasItem(DEFAULT_SELECTED_DATE.toString())))
            .andExpect(jsonPath("$.[*].routineType").value(hasItem(DEFAULT_ROUTINE_TYPE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRoutinesWithEagerRelationshipsIsEnabled() throws Exception {
        when(routineRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRoutineMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(routineRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllRoutinesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(routineRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restRoutineMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(routineRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getRoutine() throws Exception {
        // Initialize the database
        routineRepository.saveAndFlush(routine);

        // Get the routine
        restRoutineMockMvc
            .perform(get(ENTITY_API_URL_ID, routine.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(routine.getId().intValue()))
            .andExpect(jsonPath("$.selectedDate").value(DEFAULT_SELECTED_DATE.toString()))
            .andExpect(jsonPath("$.routineType").value(DEFAULT_ROUTINE_TYPE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingRoutine() throws Exception {
        // Get the routine
        restRoutineMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRoutine() throws Exception {
        // Initialize the database
        routineRepository.saveAndFlush(routine);

        int databaseSizeBeforeUpdate = routineRepository.findAll().size();

        // Update the routine
        Routine updatedRoutine = routineRepository.findById(routine.getId()).get();
        // Disconnect from session so that the updates on updatedRoutine are not directly saved in db
        em.detach(updatedRoutine);
        updatedRoutine.selectedDate(UPDATED_SELECTED_DATE).routineType(UPDATED_ROUTINE_TYPE);

        restRoutineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRoutine.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRoutine))
            )
            .andExpect(status().isOk());

        // Validate the Routine in the database
        List<Routine> routineList = routineRepository.findAll();
        assertThat(routineList).hasSize(databaseSizeBeforeUpdate);
        Routine testRoutine = routineList.get(routineList.size() - 1);
        assertThat(testRoutine.getSelectedDate()).isEqualTo(UPDATED_SELECTED_DATE);
        assertThat(testRoutine.getRoutineType()).isEqualTo(UPDATED_ROUTINE_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingRoutine() throws Exception {
        int databaseSizeBeforeUpdate = routineRepository.findAll().size();
        routine.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoutineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, routine.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(routine))
            )
            .andExpect(status().isBadRequest());

        // Validate the Routine in the database
        List<Routine> routineList = routineRepository.findAll();
        assertThat(routineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRoutine() throws Exception {
        int databaseSizeBeforeUpdate = routineRepository.findAll().size();
        routine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoutineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(routine))
            )
            .andExpect(status().isBadRequest());

        // Validate the Routine in the database
        List<Routine> routineList = routineRepository.findAll();
        assertThat(routineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRoutine() throws Exception {
        int databaseSizeBeforeUpdate = routineRepository.findAll().size();
        routine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoutineMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(routine)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Routine in the database
        List<Routine> routineList = routineRepository.findAll();
        assertThat(routineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRoutineWithPatch() throws Exception {
        // Initialize the database
        routineRepository.saveAndFlush(routine);

        int databaseSizeBeforeUpdate = routineRepository.findAll().size();

        // Update the routine using partial update
        Routine partialUpdatedRoutine = new Routine();
        partialUpdatedRoutine.setId(routine.getId());

        partialUpdatedRoutine.routineType(UPDATED_ROUTINE_TYPE);

        restRoutineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoutine.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoutine))
            )
            .andExpect(status().isOk());

        // Validate the Routine in the database
        List<Routine> routineList = routineRepository.findAll();
        assertThat(routineList).hasSize(databaseSizeBeforeUpdate);
        Routine testRoutine = routineList.get(routineList.size() - 1);
        assertThat(testRoutine.getSelectedDate()).isEqualTo(DEFAULT_SELECTED_DATE);
        assertThat(testRoutine.getRoutineType()).isEqualTo(UPDATED_ROUTINE_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateRoutineWithPatch() throws Exception {
        // Initialize the database
        routineRepository.saveAndFlush(routine);

        int databaseSizeBeforeUpdate = routineRepository.findAll().size();

        // Update the routine using partial update
        Routine partialUpdatedRoutine = new Routine();
        partialUpdatedRoutine.setId(routine.getId());

        partialUpdatedRoutine.selectedDate(UPDATED_SELECTED_DATE).routineType(UPDATED_ROUTINE_TYPE);

        restRoutineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoutine.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoutine))
            )
            .andExpect(status().isOk());

        // Validate the Routine in the database
        List<Routine> routineList = routineRepository.findAll();
        assertThat(routineList).hasSize(databaseSizeBeforeUpdate);
        Routine testRoutine = routineList.get(routineList.size() - 1);
        assertThat(testRoutine.getSelectedDate()).isEqualTo(UPDATED_SELECTED_DATE);
        assertThat(testRoutine.getRoutineType()).isEqualTo(UPDATED_ROUTINE_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingRoutine() throws Exception {
        int databaseSizeBeforeUpdate = routineRepository.findAll().size();
        routine.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoutineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, routine.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(routine))
            )
            .andExpect(status().isBadRequest());

        // Validate the Routine in the database
        List<Routine> routineList = routineRepository.findAll();
        assertThat(routineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRoutine() throws Exception {
        int databaseSizeBeforeUpdate = routineRepository.findAll().size();
        routine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoutineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(routine))
            )
            .andExpect(status().isBadRequest());

        // Validate the Routine in the database
        List<Routine> routineList = routineRepository.findAll();
        assertThat(routineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRoutine() throws Exception {
        int databaseSizeBeforeUpdate = routineRepository.findAll().size();
        routine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoutineMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(routine)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Routine in the database
        List<Routine> routineList = routineRepository.findAll();
        assertThat(routineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRoutine() throws Exception {
        // Initialize the database
        routineRepository.saveAndFlush(routine);

        int databaseSizeBeforeDelete = routineRepository.findAll().size();

        // Delete the routine
        restRoutineMockMvc
            .perform(delete(ENTITY_API_URL_ID, routine.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Routine> routineList = routineRepository.findAll();
        assertThat(routineList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
