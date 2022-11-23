SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[UpdateTransactionCode]
(
@TransactionCodeID int,
@TransCode varchar(10),
@Description varchar(50),
@Status bit,
@ModifyBy int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	update TransactionCode set TransCode=@TransCode ,Description=@Description ,Status=@Status,ModifiedDate=CURRENT_TIMESTAMP,ModifiedBy=@ModifyBy where TransactionCodeID=@TransactionCodeID
	

END



GO