SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[GetCRWRollUpWithBlank]    -- exec GetCRWRollUpWithBlank 1,1,3
(
    @BudgetFileID int,
	@BudgetID int,
	@Prodid int
)
AS

BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	 declare @CHILDn Int;
   declare @AccountCoden varchar(50);
   declare @PARENTn Int;
   declare @detailleveln Int;
   declare @COAIDn Varchar(30);
   declare @AccountNamen varchar(100);
   declare @Budgetn decimal(18,2);
   declare @Postingn bit;
   declare @POAmountn decimal(18,2);
   declare @ActualtoDaten decimal(18,2);
   declare @ActualthisPeriodn decimal(18,2);
   declare @EFCn decimal(18,2);
   declare @ETCn decimal(18,2);
   declare @ChildCountn int;
   declare @GENERATIONn int;
   declare @hierarchyn varchar(500);
   declare @Budget1n decimal(18,2);
   declare @POAmount1n decimal(18,2);
   declare @ActualtoDate1n decimal(18,2);
   declare @ActualthisPeriod1n decimal(18,2);


Declare @Mtree1 TABLE (CHILD Int,AccountCode varchar(50),PARENT Int,detaillevel Int,COAID Varchar(30),AccountName varchar(100),
Budget decimal(18,2),Posting bit,POAmount decimal(18,2),ActualtoDate decimal(18,2),ActualthisPeriod decimal(18,2),
EFC decimal(18,2),ETC decimal(18,2),ChildCount int,GENERATION int,hierarchy varchar(500), Budget1 decimal(18,2) null,POAmount1 decimal(18,2) null,ActualtoDate1 decimal(18,2) null
,ActualthisPeriod1 decimal(18,2) null
)


Declare @CrwTable TABLE (CHILD Int,AccountCode varchar(50),PARENT Int,detaillevel Int,COAID Varchar(30),AccountName varchar(100),
Budget decimal(18,2),Posting bit,POAmount decimal(18,2),ActualtoDate decimal(18,2),ActualthisPeriod decimal(18,2),
EFC decimal(18,2),ETC decimal(18,2),ChildCount int,GENERATION int,hierarchy varchar(500), Budget1 decimal(18,2) null,
POAmount1 decimal(18,2) null,ActualtoDate1 decimal(18,2) null
,ActualthisPeriod1 decimal(18,2) null
)




    Insert into @Mtree1
	exec [dbo].[GetCRWRollUp] @BudgetFileID,@BudgetID,@Prodid;
	--- GetCRWRollUp 1,1,3
	


  
 
    DECLARE Cus_Category CURSOR FOR 
    select CHILD ,AccountCode ,PARENT ,detaillevel ,COAID ,AccountName ,
Budget ,Posting ,POAmount ,ActualtoDate ,ActualthisPeriod ,
EFC ,ETC ,ChildCount ,GENERATION ,hierarchy , Budget1 ,
POAmount1 ,ActualtoDate1 ,ActualthisPeriod1 from @Mtree1
	
     open Cus_Category;
     fetch next from Cus_Category into @CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,@AccountNamen ,@Budgetn ,
   @Postingn ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
    @Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n

     while @@FETCH_STATUS = 0
      begin

	   if(@Postingn=1)
	   begin
	   print 1;
	 --  insert into @CrwTable values (@CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,@AccountNamen ,@Budgetn ,
  -- @Postingn ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
  --  @Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n);

	 --insert into @CrwTable values (@CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,'(Blank)' ,@Budgetn ,
  --  0 ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
  --  @Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n);


	   end
	   else
	   begin
	    --insert into @CrwTable values (@CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,@AccountNamen ,@Budgetn ,
     --   @Postingn ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
     --   @Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n);
	 print 2;
	   end
	end
	  
       fetch next from Cus_Category into @CHILDn , @AccountCoden , @PARENTn ,@detailleveln ,@COAIDn ,@AccountNamen ,@Budgetn ,
   @Postingn ,@POAmountn , @ActualtoDaten ,@ActualthisPeriodn , @EFCn , @ETCn , @ChildCountn , @GENERATIONn ,@hierarchyn ,
    @Budget1n ,@POAmount1n ,@ActualtoDate1n , @ActualthisPeriod1n
	  		
       CLOSE Cus_Category
     DEALLOCATE Cus_Category
	 end
	 select * from @CrwTable
	
	


GO